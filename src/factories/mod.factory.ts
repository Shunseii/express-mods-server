import { define, factory } from "typeorm-seeding";

import { Game } from "../entities/Game";
import { Mod } from "../entities/Mod";
import { User } from "../entities/User";

export interface ModFactoryContext extends Pick<Mod, "gameId" | "authorId"> {}

define<Mod, ModFactoryContext>(Mod, (faker, context) => {
  const content = faker.lorem.paragraphs(4);
  const title = faker.company.bsAdjective();

  const mod = new Mod();
  mod.title = title;
  mod.content = content;
  // mod.author = factory(User)() as any;

  if (context?.gameId) {
    mod.gameId = context.gameId;
  }

  if (context?.authorId) {
    mod.authorId = context.authorId;
  }

  return mod;
});
