import DataLoader from "dataloader";

import { User } from "../entities/User";

const createUserLoader = () =>
  new DataLoader<number, User>(async (keys) => {
    const users = await User.findByIds(keys as number[]);
    const userIdToUser: Record<number, User> = {};

    // Orders the elements according to the userId
    //   which is required for the batch fn return value
    users.forEach((user) => {
      userIdToUser[user.id] = user;
    });

    return keys.map((userId) => userIdToUser[userId]);
  });

export default createUserLoader;
