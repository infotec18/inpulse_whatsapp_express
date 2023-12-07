import { getAllUsersService } from "./getAll.service";
import { getLastUserIdService } from "./getGraphicAndTime.service";
import { updateUserService } from "./update.service";

export const getAll = getAllUsersService;
export const update = updateUserService;
export const getLastId = getLastUserIdService;
