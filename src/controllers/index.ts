import { createUserController } from "./users/create.controller";
import { getAllUsersController } from "./users/getAll.controller";
import { getOneUserByIdController } from "./users/getOneById.controller";
import { loginUserController } from "./users/login.controller";
import { softDeleteUserController } from "./users/softDelete.controller";

const controllers = {
    users: {
        create: createUserController,
        getAll: getAllUsersController,
        getOneById: getOneUserByIdController,
        login: loginUserController,
        softDelete: softDeleteUserController
    }
};

export default controllers;