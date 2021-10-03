import { define } from "typeorm-seeding";

import { Game } from "../entities/Game";

export type GameFactoryContext = Pick<
  Game,
  "name" | "gameSlug" | "imageName" | "description"
>;

define<Game, GameFactoryContext>(Game, (faker, context) => {
  const game = new Game();
  const uuid = faker.random.uuid();

  game.id = uuid;
  game.name = context?.name || faker.lorem.words(3);
  game.gameSlug = context?.gameSlug || faker.lorem.word();
  game.description = context?.description || faker.lorem.paragraph();
  game.imageName = context?.imageName || faker.lorem.word();

  return game;
});
