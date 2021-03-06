import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { Context } from "../types";
import { CreateCommentInput, UpdateCommentInput } from "./types";

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  async author(
    @Root() root: Comment,
    @Ctx() { userLoader }: Context
  ): Promise<User | undefined> {
    return userLoader.load(root.authorId);
  }

  @FieldResolver(() => Boolean)
  isOwner(@Root() root: Comment, @Ctx() { req }: Context): boolean {
    const currentUserId = req.session.userId;

    return root.authorId === currentUserId;
  }

  @Query(() => Comment, { nullable: true })
  async comment(@Arg("id") id: number): Promise<Comment | undefined> {
    return Comment.findOne(id);
  }

  @Authorized()
  @Mutation(() => Comment)
  async createComment(
    @Ctx() { req, modLoader }: Context,
    @Arg("options") { content, modId }: CreateCommentInput
  ): Promise<Comment | undefined> {
    const authorId = req.session.userId;

    const mod = await modLoader.load(modId);

    if (!mod) {
      throw new Error("That mod does not exist.");
    }

    return Comment.create({ content, authorId, modId }).save();
  }

  @Authorized()
  @Mutation(() => Comment, { nullable: true })
  async updateComment(
    @Arg("options") { id, content }: UpdateCommentInput,
    @Ctx() { req }: Context
  ): Promise<Comment | undefined> {
    const { userId: currentUserId } = req.session;
    const comment = await Comment.findOne(id);

    if (!comment) return undefined;

    if (currentUserId !== comment.authorId) return undefined;

    comment.content = content;

    return Comment.save(comment);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteComment(
    @Arg("id", () => String) id: string,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    await Comment.delete({ id, authorId: req.session.userId });

    return true;
  }
}
