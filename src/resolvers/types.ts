import { Field, InputType, Int, ObjectType } from "type-graphql";
import { IsEmail, MinLength, Length } from "class-validator";

import { IsUserFieldNotInUse } from "../decorators/IsUserFieldNotInUse";
import { INVALID_EMAIL, INVALID_LENGTH, TOO_SHORT } from "./messages";
import { Mod } from "../entities/Mod";

@ObjectType()
export class PaginatedMods {
  @Field(() => [Mod])
  mods: Mod[];

  @Field()
  hasMore: boolean;
}

@InputType()
export class RegisterUserInput {
  @Field()
  @IsEmail({}, { message: INVALID_EMAIL })
  @IsUserFieldNotInUse()
  email!: string;

  @Field()
  @IsUserFieldNotInUse()
  @MinLength(2, { message: TOO_SHORT })
  username!: string;

  @Field()
  @MinLength(6, { message: TOO_SHORT })
  password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  token!: string;

  @Field()
  @MinLength(6, { message: TOO_SHORT })
  newPassword!: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail({}, { message: INVALID_EMAIL })
  email!: string;
}

@InputType()
export class CreateModInput {
  @Field()
  @Length(4, 255, { message: INVALID_LENGTH })
  title!: string;

  @Field()
  @MinLength(16, { message: TOO_SHORT })
  content!: string;

  @Field()
  gameSlug!: string;
}

@InputType()
export class UpdateModInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  @Length(4, 255, { message: INVALID_LENGTH })
  title?: string;

  @Field({ nullable: true })
  @MinLength(16, { message: TOO_SHORT })
  content?: string;
}

@InputType()
export class CreateCommentInput {
  @Field()
  @MinLength(1, { message: TOO_SHORT })
  content!: string;

  @Field()
  modId!: string;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  id!: string;

  @Field()
  @MinLength(1, { message: TOO_SHORT })
  content!: string;
}
