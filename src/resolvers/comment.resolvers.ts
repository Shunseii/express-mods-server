import { Resolver } from "type-graphql";

import { Comment } from "../entities/Comment";

@Resolver(Comment)
export class CommentResolver {}
