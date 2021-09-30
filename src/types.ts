import { Request, Response } from "express";
import { Redis } from "ioredis";
import createLikeLoader from "./utils/createLikeLoader";
import createLikesCountLoader from "./utils/createLikesCountLoader";
import createModLoader from "./utils/createModLoader";

import createUserLoader from "./utils/createUserLoader";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface Context {
  req: Request;
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  modLoader: ReturnType<typeof createModLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
  likesCountLoader: ReturnType<typeof createLikesCountLoader>;
}
