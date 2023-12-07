import { getAllUsersController } from "./getAll.controller";
import { getLastUserIdController } from "./getLastId.controller";
import { updateUserController } from "./update.controller";

export const getAll = getAllUsersController;
export const update = updateUserController;
export const getLastId = getLastUserIdController;
