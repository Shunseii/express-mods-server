import { Field, InputType, Int } from "type-graphql";
import { IsEmail, MinLength, Length } from "class-validator";

import { IsUserFieldNotInUse } from "../decorators/IsUserFieldNotInUse";
import { IsPostFieldNotInUse } from "../decorators/IsPostFieldNotInUse";
import { INVALID_EMAIL, INVALID_LENGTH, TOO_SHORT } from "./messages";

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
export class CreatePostInput {
  @Field()
  @IsPostFieldNotInUse()
  @Length(4, 255, { message: INVALID_LENGTH })
  title!: string;

  @Field({ nullable: true })
  @MinLength(16, { message: TOO_SHORT })
  content?: string;
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  @IsPostFieldNotInUse()
  @Length(4, 255, { message: INVALID_LENGTH })
  title?: string;

  @Field({ nullable: true })
  @MinLength(16, { message: TOO_SHORT })
  content?: string;
}
