import "reflect-metadata";

import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import cors from "cors";

import {
  IS_PROD,
  PORT,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
  COOKIE_SECRET,
  FRONT_END_URL,
} from "./constants";
import { Context } from "./types";
import authChecker from "./auth/authChecker";
import createUserLoader from "./utils/createUserLoader";
import createLikeLoader from "./utils/createLikeLoader";
import createLikesCountLoader from "./utils/createLikesCountLoader";
import { CommentResolver } from "./resolvers/comment.resolvers";
import { UserResolver } from "./resolvers/user.resolvers";
import { ModResolver } from "./resolvers/mod.resolvers";
import { GameResolver } from "./resolvers/game.resolvers";
import createModLoader from "./utils/createModLoader";

(async () => {
  const conn = await createConnection();
  await conn.runMigrations();

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      credentials: true,
      origin: FRONT_END_URL,
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
      secret: COOKIE_SECRET,
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
      userLoader: createUserLoader(),
      modLoader: createModLoader(),
      likeLoader: createLikeLoader(),
      likesCountLoader: createLikesCountLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  });
})();
