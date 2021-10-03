import DataLoader from "dataloader";

import { Mod } from "../entities/Mod";

const createModLoader = () =>
  new DataLoader<string, Mod>(async (keys) => {
    const mods = await Mod.findByIds(keys as string[]);
    const modIdToMod: Record<string, Mod> = {};

    // Orders the elements according to the userId
    //   which is required for the batch fn return value
    mods.forEach((mod) => {
      modIdToMod[mod.id] = mod;
    });

    return keys.map((modId) => modIdToMod[modId]);
  });

export default createModLoader;
