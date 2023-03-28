import { getOneAvatarByUserIdController } from "./avatars/getOneById.controller";
import { insertUserAvatarController } from "./avatars/insert.controller";
import { createUserController } from "./users/create.controller";
import { getAllUsersController } from "./users/getAll.controller";
import { getLastUserIdController } from "./users/getLastId.controller";
import { getOneUserByIdController } from "./users/getOneById.controller";
import { loginUserController } from "./users/login.controller";
import { recoverUserController } from "./users/recover.controller";
import { softDeleteUserController } from "./users/softDelete.controller";
import { updateUserController } from "./users/update.controller";
import { createCostumerController } from "./costumers/create.controller";
import { getAllCostumersController } from "./costumers/getAll.controller";
import { getOneCostumerByIdController } from "./costumers/getOneById.controller";
import { deleteCostumerController } from "./costumers/delete.controller";
import { recoverCostumerController } from "./costumers/recover.controller";
import { updateCostumerController } from "./costumers/update.controller";
import { getLastCostumerIdController } from "./costumers/getLastId.controller";

const controllers = {
    users: {
        create: createUserController,
        getAll: getAllUsersController,
        getOneById: getOneUserByIdController,
        login: loginUserController,
        softDelete: softDeleteUserController,
        recover: recoverUserController,
        update: updateUserController,
        getLastId: getLastUserIdController
    },
    avatars: {
        insert: insertUserAvatarController,
        getOneByUserId: getOneAvatarByUserIdController
    },
    costumers: {
        create: createCostumerController,
        getAll: getAllCostumersController,
        getOneById: getOneCostumerByIdController,
        softDelete: deleteCostumerController,
        recover: recoverCostumerController,
        update: updateCostumerController,
        getLastId: getLastCostumerIdController
    }
};

export default controllers;