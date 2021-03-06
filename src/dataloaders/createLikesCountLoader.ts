import DataLoader from "dataloader";
import { In } from "typeorm";

import { Like } from "../entities/Like";

const createLikesCountLoader = () =>
  new DataLoader<string, number>(async (keys) => {
    const modLikes = await Like.find({
      where: { modId: In(keys as string[]) },
    });
    const likesCounts: Record<string, number> = {};

    modLikes.forEach((like) => {
      likesCounts[like.modId] =
        likesCounts[like.modId] === undefined ? 1 : likesCounts[like.modId] + 1;
    });

    return keys.map((modId) =>
      likesCounts[modId] === undefined ? 0 : likesCounts[modId]
    );
  });

export default createLikesCountLoader;
