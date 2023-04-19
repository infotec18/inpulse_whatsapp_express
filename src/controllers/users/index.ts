import { createUserController } from "./create.controller";
import { getAllUsersController } from "./getAll.controller";
import { getLastUserIdController } from "./getLastId.controller";
import { getOneUserByIdController } from "./getOneById.controller";
import { getSpecifiedUserController } from "./getSpecifiedUser.controller";
import { loginUserController } from "./login.controller";
import { recoverUserController } from "./recover.controller";
import { softDeleteUserController } from "./softDelete.controller";
import { updateUserController } from "./update.controller";

export const create = createUserController;
export const getAll = getAllUsersController;
export const getOneById = getOneUserByIdController;
export const login = loginUserController;
export const softDelete = softDeleteUserController;
export const recover = recoverUserController;
export const update = updateUserController;
export const getLastId = getLastUserIdController;
export const getSpecified = getSpecifiedUserController;