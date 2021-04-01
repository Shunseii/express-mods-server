import { Query, Resolver, Mutation, Arg, Ctx } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { RegisterUserInput } from "./types";
import { Context } from "../types";
import { COOKIE_NAME } from "../constants";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | undefined> {
    if (!req.session.userId) return undefined;

    return await User.findOne({ where: { id: req.session.userId } });
  }

  @Mutation(() => User)
  async register(
    @Arg("options") { username, email, password }: RegisterUserInput,
    @Ctx() { req }: Context
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const user = User.create({ username, email, password: hashedPassword });

    await User.save(user);

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: Context
  ): Promise<User | undefined> {
    const user = await User.findOne({ where: { username } });

    if (!user) return undefined;

    const valid = argon2.verify(user.password, password);

    if (!valid) return undefined;

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
