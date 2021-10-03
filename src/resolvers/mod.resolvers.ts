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
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { Upload } from "@aws-sdk/lib-storage";

import { Mod } from "../entities/Mod";
import {
  CreateModInput,
  PaginatedMods,
  UpdateModInput,
  UploadImageInput,
} from "./types";
import { Context } from "../types";
import { Game } from "../entities/Game";
import { User } from "../entities/User";
import { Like } from "../entities/Like";
import { Comment } from "../entities/Comment";
import { constructB2Url, extractFileKeyFromUrl } from "../utils/constructB2Url";

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
  async author(
    @Root() root: Mod,
    @Ctx() { userLoader }: Context
  ): Promise<User> {
    return userLoader.load(root.authorId);
  }

  @FieldResolver(() => Int)
  async likesCount(
    @Root() root: Mod,
    @Ctx() { likesCountLoader }: Context
  ): Promise<number> {
    return likesCountLoader.load(root.id);
  }

  @FieldResolver(() => Boolean)
  async hasLiked(
    @Root() root: Mod,
    @Ctx() { req, likeLoader }: Context
  ): Promise<boolean> {
    const { userId } = req.session;
    const { id: modId } = root;

    if (!userId) return false;

    const userHasLiked = await likeLoader.load({ userId, modId });

    return !!userHasLiked;
  }

  @FieldResolver(() => [Comment])
  async comments(@Root() root: Mod): Promise<Comment[]> {
    return Comment.find({ where: { modId: root.id } });
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
  mod(@Arg("id", () => String) id: string): Promise<Mod | undefined> {
    return Mod.findOne({ where: { id } });
  }

  @Authorized()
  @Mutation(() => Boolean)
  async likeMod(
    @Arg("modId", () => String) modId: string,
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
  @Mutation(() => Boolean)
  async uploadImage(
    @Arg("options") { modId, imageFile }: UploadImageInput,
    @Ctx() { s3Client }: Context
  ): Promise<boolean> {
    const mod = await Mod.findOne(modId);
    const bucketName = process.env.B2_IMAGES_BUCKET_NAME;

    // this is a promise ¯\_(ツ)_/¯
    const { filename, createReadStream } = await imageFile;
    const fileNameKey = `${v4()}__${filename}`;

    if (!mod) {
      throw new Error("That mod does not exist.");
    }

    try {
      const uploadingImages = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: fileNameKey,
          Body: createReadStream(),
        },
      });

      uploadingImages.on("httpUploadProgress", (progress) => {
        const { Bucket, Key, loaded, total, part } = progress;
        const loadedBits = !loaded ? 0 : loaded;
        const totalBits = !total ? 0 : total;
        const percentLoaded = (loadedBits / totalBits) * 100;

        console.info(
          `Uploading file '${filename}' to '${Bucket}' bucket with key '${Key}'\n`
        );
        console.info(
          `Progress for '${filename}': ${percentLoaded}% -- Part ${part}\n`
        );
      });

      await uploadingImages.done();

      const b2Url = constructB2Url({ bucketName, fileNameKey });
      console.info(`File '${filename}' uploaded at '${b2Url}'\n`);

      mod.images = [...mod.images, b2Url];
      await mod.save();

      console.info(`File '${filename}' saved to database\n\n`);

      return true;
    } catch (err) {
      console.error(`Error when uploading and storing ${filename}: ${err}\n\n`);

      return false;
    }
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
    @Arg("id", () => String) id: string,
    @Ctx() { s3Client, req }: Context
  ): Promise<boolean> {
    await Like.delete({ modId: id });

    const mod = await Mod.findOne(id);

    if (!mod) return true;

    // Delete stored images from b2
    try {
      mod.images.forEach(async (imageUrl) => {
        // Delete the image at imageUrl from b2
        const fileNameKey = extractFileKeyFromUrl(imageUrl);

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.B2_IMAGES_BUCKET_NAME,
            Key: fileNameKey,
          })
        );

        console.info(
          `Successfully deleted file with key ${fileNameKey} from b2`
        );
      });

      await Mod.delete({ id, authorId: req.session.userId });

      console.info(`Successfully removed mod '${mod.title}' from database\n\n`);
    } catch (err) {
      console.error(
        `Error removing files from b2 when attempting to delete mod '${mod.title}': ${err}\n\n`
      );

      return false;
    }

    return true;
  }
}
