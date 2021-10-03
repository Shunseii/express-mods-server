import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Mod } from "./Mod";

@ObjectType()
@Entity("games")
export class Game extends BaseEntity {
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
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column({ unique: true })
  gameSlug!: string;

  @Field()
  @Column({ unique: true })
  imageName!: string;

  @Field()
  @Column()
  description!: string;

  @OneToMany(() => Mod, (mod) => mod.game)
  mods?: Mod[];
}
