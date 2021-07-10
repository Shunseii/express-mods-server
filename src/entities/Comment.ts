import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

import { Mod } from "./Mod";
import { User } from "./User";

@ObjectType()
@Entity("comments")
export class Comment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @Field()
  @Column()
  content!: string;

  @Field(() => Int)
  @Column()
  modId!: number;

  @Field(() => Mod)
  @ManyToOne(() => Mod, (mod) => mod.comments)
  mod!: Mod;

  @Field(() => Int)
  @Column()
  authorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  author!: User;
}
