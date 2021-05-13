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

@Resolver(Mod)
export class ModResolver {
  @FieldResolver(() => String)
  contentSnippet(@Root() root: Mod): string {
    return root.content.slice(0, 50);
  }

  @FieldResolver(() => Int)
  likesCount(@Root() root: Mod): number {
    return root.likes?.length ?? 0;
  }

  @FieldResolver(() => Boolean)
  hasLiked(@Root() root: Mod, @Ctx() { req }: Context): boolean {
    const { userId } = req.session;

    return (
      !!root.likes!.find((userThatLiked) => userThatLiked.id === userId) ??
      false
    );
  }

  @FieldResolver(() => Boolean)
  isOwner(@Root() root: Mod, @Ctx() { req }: Context): boolean {
    return root.authorId === req.session.userId;
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
      relations: ["author", "likes"],
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
    return Mod.findOne({ where: { id }, relations: ["author", "likes"] });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async likeMod(
    @Arg("modId", () => Int) modId: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    const { userId: userIdThatLiked } = req.session;
    const userThatLiked = await User.findOne(userIdThatLiked);
    const modToLike = await Mod.findOne(modId, { relations: ["likes"] });

    if (!modToLike) {
      throw new Error("That mod does not exist.");
    }

    // Owner cannot like his own mod
    if (userIdThatLiked === modToLike.authorId) return false;

    const userHasAlreadyLiked = modToLike.likes?.find(
      (user) => user.id === userIdThatLiked
    );

    if (userHasAlreadyLiked) {
      modToLike.likes = modToLike.likes!.filter(
        (user) => user.id !== userIdThatLiked
      );
    } else {
      modToLike.likes = [...(modToLike.likes ?? []), userThatLiked!];
    }

    modToLike.save();

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

  @Mutation(() => Mod, { nullable: true })
  async updateMod(
    @Arg("options") { id, title, content }: UpdateModInput
  ): Promise<Mod | undefined> {
    const mod = await Mod.findOne(id);

    if (!mod) return undefined;

    if (title) mod.title = title;
    if (content) mod.content = content;

    await Mod.save(mod);

    return mod;
  }

  @Mutation(() => Boolean)
  async deleteMod(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Mod.delete(id);
    return true;
  }
}
