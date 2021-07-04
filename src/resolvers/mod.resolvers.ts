import {
  Arg,
  Int,
  Query,
  Resolver,
  Mutation,
  Ctx,
  Authorized,
  FieldResolver,
  Root,
} from "type-graphql";
import { FindConditions, ObjectLiteral, Raw } from "typeorm";

import { Mod } from "../entities/Mod";
import { CreateModInput, PaginatedMods, UpdateModInput } from "./types";
import { Context } from "../types";
import { Game } from "../entities/Game";
import { User } from "../entities/User";
import { Like } from "../entities/Like";

@Resolver(Mod)
export class ModResolver {
  @FieldResolver(() => String)
  contentSnippet(@Root() root: Mod): string {
    return root.content.slice(0, 50);
  }

  @FieldResolver(() => Boolean)
  isOwner(@Root() root: Mod, @Ctx() { req }: Context): boolean {
    return root.authorId === req.session.userId;
  }

  @FieldResolver(() => User)
  async author(@Root() root: Mod): Promise<User> {
    // By construction, every mod must have an author
    // hence we are required to assert that the user exists
    return (await User.findOne(root.authorId))!;
  }

  @FieldResolver(() => Int)
  async likesCount(@Root() root: Mod): Promise<number> {
    const likes = await Like.find({ where: { modId: root.id } });

    return likes.length;
  }

  @FieldResolver(() => Boolean)
  async hasLiked(@Root() root: Mod, @Ctx() { req }: Context): Promise<boolean> {
    const { userId } = req.session;
    const { id: modId } = root;

    const userHasLiked = await Like.findOne({ where: { userId, modId } });

    return !!userHasLiked;
  }

  @Query(() => PaginatedMods)
  async mods(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("gameSlug", () => String, { nullable: true }) gameSlug?: string
  ): Promise<PaginatedMods> {
    const realLimit = Math.min(50, limit);
    const where:
      | string
      | ObjectLiteral
      | FindConditions<Mod>
      | FindConditions<Mod>[] = {};

    if (cursor) where.createdAt = Raw((alias) => `${alias} < '${cursor}'`);
    if (gameSlug) {
      const game = await Game.findOne({ where: { gameSlug } });
      if (!game) throw new Error("That game does not exist.");

      where.gameId = game.id;
    }

    const mods = await Mod.find({
      where,
      order: { createdAt: "DESC" },
      take: realLimit + 1, // Fetch an extra mod to see if there are additional ones for subsequent calls
    });

    return {
      mods: mods.slice(0, realLimit),
      hasMore: mods.length === realLimit + 1,
    };
  }

  @Query(() => Mod, { nullable: true })
  mod(@Arg("id", () => Int) id: number): Promise<Mod | undefined> {
    return Mod.findOne({ where: { id } });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async likeMod(
    @Arg("modId", () => Int) modId: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    const { userId } = req.session;
    const modToLike = await Mod.findOne(modId);

    if (!modToLike) {
      throw new Error("That mod does not exist.");
    }

    // Owner cannot like his own mod
    if (userId === modToLike.authorId) return false;

    const userHasAlreadyLiked = !!(await Like.findOne({
      where: { userId, modId },
    }));

    // If user calls this mutation when they've already liked the mod
    //   it means they want to unlike the mod
    if (userHasAlreadyLiked) {
      Like.delete({ userId, modId });
    } else {
      Like.create({ userId, modId }).save();
    }

    return true;
  }

  @Authorized()
  @Mutation(() => Mod)
  async createMod(
    @Arg("options") { title, content, gameSlug }: CreateModInput,
    @Ctx() { req }: Context
  ): Promise<Mod> {
    const game = await Game.findOne({ where: { gameSlug } });

    if (!game) {
      throw new Error("That game does not exist.");
    }

    return Mod.create({
      title,
      content,
      authorId: req.session.userId,
      gameId: game.id,
    }).save();
  }

  @Authorized()
  @Mutation(() => Mod, { nullable: true })
  async updateMod(
    @Arg("options") { id, title, content }: UpdateModInput,
    @Ctx() { req }: Context
  ): Promise<Mod | undefined> {
    const { userId: currentUserId } = req.session;
    const mod = await Mod.findOne(id);

    if (!mod) return undefined;

    if (currentUserId !== mod.authorId) return undefined;

    if (title) mod.title = title;
    if (content) mod.content = content;

    await Mod.save(mod);

    return mod;
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteMod(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    await Like.delete({ modId: id });
    await Mod.delete({ id, authorId: req.session.userId });
    return true;
  }
}
