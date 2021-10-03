import { Request, Response } from "express";
import { Redis } from "ioredis";
import { S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

import createLikesCountLoader from "./dataloaders/createLikesCountLoader";
import createModLoader from "./dataloaders/createModLoader";
import createLikeLoader from "./dataloaders/createLikeLoader";
import createUserLoader from "./dataloaders/createUserLoader";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export interface UploadedFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}

export interface Context {
  req: Request;
  res: Response;
  redis: Redis;
  s3Client: S3Client;
  userLoader: ReturnType<typeof createUserLoader>;
  modLoader: ReturnType<typeof createModLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
  likesCountLoader: ReturnType<typeof createLikesCountLoader>;
}
