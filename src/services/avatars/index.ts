import { getOneAvatarByUserIdService } from "./getOneByUserId.service";
import { insertUserAvatarService } from "./insert.service";

export const insert = insertUserAvatarService;
export const getOneById = getOneAvatarByUserIdService;