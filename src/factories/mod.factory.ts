import { define } from "typeorm-seeding";

import { Mod } from "../entities/Mod";

export type ModFactoryContext = Pick<Mod, "gameId" | "authorId">;

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
