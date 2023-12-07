import { createUserController } from "./create.controller";
import { getAllUsersController } from "./getAll.controller";
import { getLastUserIdController } from "./getLastId.controller";
import { getSpecifiedUserController } from "./getSpecifiedUser.controller";
import { loginUserController } from "./login.controller";
import { updateUserController } from "./update.controller";

export const create = createUserController;
export const getAll = getAllUsersController;
export const login = loginUserController;
export const update = updateUserController;
export const getLastId = getLastUserIdController;
export const getSpecified = getSpecifiedUserController;