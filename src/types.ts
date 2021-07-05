import { Request, Response } from "express";
import { Redis } from "ioredis";
import createLikeLoader from "./utils/createLikeLoader";
import createLikesCountLoader from "./utils/createLikesCountLoader";

import createUserLoader from "./utils/createUserLoader";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export interface Context {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
  likesCountLoader: ReturnType<typeof createLikesCountLoader>;
}
