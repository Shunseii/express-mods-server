import "reflect-metadata";

import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

import { UserResolver } from "./resolvers/user.resolvers";
import { PostResolver } from "./resolvers/post.resolvers";
import {
  IS_PROD,
  PORT,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
  COOKIE_SECRET,
} from "./constants";
import { Context } from "./types";

(async () => {
  await createConnection();

  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
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
    resolvers: [UserResolver, PostResolver],
    emitSchemaFile: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): Context => ({ req, res }),
  });

  apolloServer.applyMiddleware({
    app,
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
  });
})();
