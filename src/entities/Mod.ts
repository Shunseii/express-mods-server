import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { Game } from "./Game";
import { Like } from "./Like";
import { User } from "./User";
import { Comment } from "./Comment";

@ObjectType()
@Entity("mods")
export class Mod extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  content!: string;

  @Field(() => [String])
  @Column("text", { array: true, default: () => "array[]::text[]" })
  images!: string[];

  @OneToMany(() => Like, (like) => like.mod)
  likes?: Like[];

  @Field()
  @Column()
  authorId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.mods)
  author!: User;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.mod)
  comments?: Comment[];

  @Field()
  @Column()
  gameId!: string;

  @ManyToOne(() => Game, (game) => game.mods)
  game!: Game;
}
