import DataLoader from "dataloader";

import { Like } from "../entities/Like";

const createLikeLoader = () =>
  new DataLoader<{ userId: string; modId: string }, Like | null>(
    async (keys) => {
      const likes = await Like.findByIds(keys as any);
      const likesIdsToLike: Record<string, Like> = {};

      likes.forEach((like) => {
        likesIdsToLike[`${like.userId}${like.modId}`] = like;
      });

      return keys.map(
        ({ userId, modId }) => likesIdsToLike[`${userId}${modId}`]
      );
    }
  );

export default createLikeLoader;
