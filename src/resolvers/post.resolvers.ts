import { Arg, Int, Query, Resolver, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { CreatePostInput, UpdatePostInput } from "./types";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("options") { title, content }: CreatePostInput
  ): Promise<Post> {
    const post = Post.create({ title, content });

    await Post.save(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("options") { id, title, content }: UpdatePostInput
  ): Promise<Post | undefined> {
    const post = await Post.findOne({ where: { id } });

    if (!post) return undefined;

    if (title) post.title = title;
    if (content) post.content = content;

    await Post.save(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async deletePost(
    @Arg("id", () => Int) id: number
  ): Promise<Post | undefined> {
    const post = await Post.findOne({ where: { id } });

    if (!post) return undefined;

    await Post.delete(id);

    return post;
  }
}
