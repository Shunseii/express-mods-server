import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";

import { Game } from "../entities/Game";

@Resolver(Game)
export class GameResolver {
  @FieldResolver(() => Int)
  modsCount(@Root() root: Game) {
    return root.mods?.length ?? 0;
  }

  @Query(() => [Game])
  games(): Promise<Game[]> {
    return Game.find({ relations: ["mods"] });
  }

  @Query(() => Game, { nullable: true })
  game(@Arg("gameSlug") gameSlug: string): Promise<Game | undefined> {
    return Game.findOne({
      where: { gameSlug },
      relations: ["mods"],
    });
  }
}
