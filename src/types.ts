import { Request, Response } from "express";
import { Redis } from "ioredis";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export interface Context {
  req: Request;
  res: Response;
  redis: Redis;
}
