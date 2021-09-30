import {
  Query,
  Resolver,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

import { User } from "../entities/User";
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  RegisterUserInput,
} from "./types";
import { Context } from "../types";
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import sendEmail from "../utils/sendEmail";
import { Mod } from "../entities/Mod";
import { Comment } from "../entities/Comment";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() root: User, @Ctx() { req }: Context) {
    if (req.session.userId !== root.id) {
      return "";
    }

    return root.email;
  }

  @FieldResolver(() => [Comment])
  async comments(@Root() root: User): Promise<Comment[]> {
    return Comment.find({ where: { authorId: root.id } });
  }

  @FieldResolver(() => [Mod])
  async likedMods(@Ctx() { req }: Context): Promise<Mod[]> {
    const likedMods = (await getConnection().query(
      `
      SELECT mods.* 
      FROM likes
      LEFT JOIN mods
      ON likes."modId" = mods.id
      WHERE likes."userId" = $1
    `,
      [req.session.userId]
    )) as Mod[];

    return likedMods;
  }

  @FieldResolver(() => [Mod])
  async mods(@Ctx() { req }: Context): Promise<Mod[]> {
    return Mod.find({ where: { authorId: req.session.userId } });
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    if (!req.session.userId) return undefined;

    return User.findOne({
      where: { id: req.session.userId },
    });
  }

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("options") { token, newPassword }: ChangePasswordInput,
    @Ctx() { req, redis }: Context
  ): Promise<User | undefined> {
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) return undefined;

    const user = await User.findOne(userId);
    if (!user) return undefined;

    User.update({ id: userId }, { password: newPassword });

    await redis.del(key);
    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("options") { email }: ForgotPasswordInput,
    @Ctx() { redis }: Context
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    const token = v4();

    if (!user) return true;

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">
        Click here to change your password
      </a>`
    );

    return true;
  }

  @Mutation(() => User)
  async register(
    @Arg("options") { username, email, password }: RegisterUserInput,
    @Ctx() { req }: Context
  ): Promise<User> {
    const user = await User.create({
      username,
      email,
      password,
    }).save();

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

    const valid = await argon2.verify(user.password, password);
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
