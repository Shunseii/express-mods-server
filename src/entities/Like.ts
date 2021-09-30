import { Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";

import { Mod } from "./Mod";
import { User } from "./User";

@Entity("likes")
export class Like extends BaseEntity {
  @PrimaryColumn()
  userId!: string;

  @ManyToOne(() => User, (user) => user.likedMods)
  user!: User;

  @PrimaryColumn()
  modId!: string;

  @ManyToOne(() => Mod, (mod) => mod.likes)
  mod!: Mod;
}
