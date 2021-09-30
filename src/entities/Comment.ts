import { Field, ObjectType } from "type-graphql";
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
  content!: string;

  @Field()
  @Column()
  modId!: string;

  @Field(() => Mod)
  @ManyToOne(() => Mod, (mod) => mod.comments)
  mod!: Mod;

  @Field()
  @Column()
  authorId!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  author!: User;
}
