import { createUserService } from "./create.service";
import { getAllUsersService } from "./getAll.service";
import { getLastUserIdService } from "./getGraphicAndTime.service";
import { getOneUserByIdService } from "./getOneById.service";
import { loginUserService } from "./login.service";
import { recoverUserService } from "./recover.service";
import { softDeleteUserService } from "./softDelete.service";
import { updateUserService } from "./update.service";

export const create = createUserService;
export const getAll = getAllUsersService;
export const getOneById = getOneUserByIdService;
export const login = loginUserService;
export const recover = recoverUserService;
export const softDelete = softDeleteUserService;
export const update = updateUserService;
export const getLastId = getLastUserIdService;
