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
import { createCustomerController } from "./customers/create.controller";
import { getAllCustomersController } from "./customers/getAll.controller";
import { getOneCustomerByIdController } from "./customers/getOneById.controller";
import { deleteCustomerController } from "./customers/delete.controller";
import { recoverCustomerController } from "./customers/recover.controller";
import { updateCustomerController } from "./customers/update.controller";
import { getLastCustomerIdController } from "./customers/getLastId.controller";
import { getOneNumberByIdController } from "./numbers/getOneById.controller";
import { downloadFileController } from "./files/download.controller";
import { returnBase64Controller } from "./files/returnBase64.controller";

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
    customers: {
        create: createCustomerController,
        getAll: getAllCustomersController,
        getOneById: getOneCustomerByIdController,
        softDelete: deleteCustomerController,
        recover: recoverCustomerController,
        update: updateCustomerController,
        getLastId: getLastCustomerIdController
    },
    numbers: {
        getOneById: getOneNumberByIdController
    },
    files: {
        download: downloadFileController,
        base64: returnBase64Controller
    }
};

export default controllers;