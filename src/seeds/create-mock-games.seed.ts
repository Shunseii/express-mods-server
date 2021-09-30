import { Factory, Seeder } from "typeorm-seeding";

import { Game } from "../entities/Game";
import { Mod } from "../entities/Mod";
import { User } from "../entities/User";
import { GameFactoryContext } from "../factories/game.factory";
import {
  getRandomArrElement,
  getRandomNumBetween,
} from "../utils/getRandomNum";

const AllGames: GameFactoryContext[] = [
  {
    name: "The Elder Scrolls V: Skyrim",
    gameSlug: "skyrim",
    imageName: "skyrim",
    description:
      "The next chapter in the highly anticipated Elder Scrolls saga arrives from the makers of the 2006 and 2008 Games of the Year, Bethesda Game Studios. Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.",
  },
];

export default class CreateMockGames implements Seeder {
  public async run(factory: Factory) {
    let count = 0;

    const createdGames = await factory<Game, GameFactoryContext>(Game)()
      .map(async (game) => {
        const { name, imageName, gameSlug, description } = AllGames[count++];

        game.name = name;
        game.gameSlug = gameSlug;
        game.imageName = imageName;
        game.description = description;

        return game;
      })
      .createMany(AllGames.length);

    const createdUsers = await factory(User)().createMany(
      getRandomNumBetween(1, 7)
    );

    await factory(Mod)()
      .map(async (mod) => {
        const randomGame = getRandomArrElement(createdGames);
        const randomUser = getRandomArrElement(createdUsers);

        mod.author = randomUser;
        mod.game = randomGame;

        return mod;
      })
      .createMany(20);
  }
}
