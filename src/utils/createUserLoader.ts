import DataLoader from "dataloader";

import { User } from "../entities/User";

const createUserLoader = () =>
  new DataLoader<string, User>(async (keys) => {
    const users = await User.findByIds(keys as string[]);
    const userIdToUser: Record<string, User> = {};

    // Orders the elements according to the userId
    //   which is required for the batch fn return value
    users.forEach((user) => {
      userIdToUser[user.id] = user;
    });

    return keys.map((userId) => userIdToUser[userId]);
  });

export default createUserLoader;
