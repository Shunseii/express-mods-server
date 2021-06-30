import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Game } from "./Game";
import { User } from "./User";

@ObjectType()
@Entity("mods")
export class Mod extends BaseEntity {
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
  title!: string;

  @Field()
  @Column()
  content!: string;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.likedMods)
  @JoinTable()
  likes?: User[];

  @Field(() => Int)
  @Column()
  authorId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.mods)
  author!: User;

  @Field(() => Int)
  @Column()
  gameId!: number;

  @ManyToOne(() => Game, (game) => game.mods)
  game!: Game;
}
