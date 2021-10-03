import "reflect-metadata";
import "dotenv-safe/config";

import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";

import { IS_PROD, COOKIE_NAME, COOKIE_MAX_AGE } from "./constants";
import { Context } from "./types";
import authChecker from "./auth/authChecker";
import createUserLoader from "./dataloaders/createUserLoader";
import createLikeLoader from "./dataloaders/createLikeLoader";
import createLikesCountLoader from "./dataloaders/createLikesCountLoader";
import { CommentResolver } from "./resolvers/comment.resolvers";
import { UserResolver } from "./resolvers/user.resolvers";
import { ModResolver } from "./resolvers/mod.resolvers";
import { GameResolver } from "./resolvers/game.resolvers";
import createModLoader from "./dataloaders/createModLoader";
import { s3Client } from "./utils/createS3Client";

(async () => {
  const conn = await createConnection();
  await conn.runMigrations();

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(
    cors({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: IS_PROD,
      },
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );

  const schema = await buildSchema({
    resolvers: [UserResolver, ModResolver, GameResolver, CommentResolver],
    authChecker,
    emitSchemaFile: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({
      req,
      res,
      redis,
      s3Client: s3Client,
      userLoader: createUserLoader(),
      modLoader: createModLoader(),
      likeLoader: createLikeLoader(),
      likesCountLoader: createLikesCountLoader(),
    }),
  });

  app.use(graphqlUploadExpress());

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}.`);
  });
})();
