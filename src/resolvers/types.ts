import { Field, InputType, Int } from "type-graphql";
import { IsEmail, MinLength, Length } from "class-validator";
import { IsUserFieldInUse } from "../decorators/IsUserFieldInUse";
import { IsPostFieldInUse } from "../decorators/IsPostFieldInUse";

@InputType()
export class RegisterUserInput {
  @Field()
  @IsEmail()
  @IsUserFieldInUse()
  email!: string;

  @Field()
  @IsUserFieldInUse()
  @MinLength(2)
  username!: string;

  @Field()
  @MinLength(6)
  password!: string;
}

@InputType()
export class CreatePostInput {
  @Field()
  @IsPostFieldInUse()
  @Length(4, 255)
  title!: string;

  @Field({ nullable: true })
  @MinLength(16)
  content?: string;
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  @IsPostFieldInUse()
  @Length(4, 255)
  title?: string;

  @Field({ nullable: true })
  @MinLength(16)
  content?: string;
}
