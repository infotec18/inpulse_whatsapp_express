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
import { createWNumberController } from "./Wnumbers/create.controller";
import { deleteWNumberController } from "./Wnumbers/delete.controller";
import { getOneNumberByIdController } from "./Wnumbers/getOneById.controller";
import { updateNumberController } from "./Wnumbers/update.controller";
import { createReadyMessageController } from "./readyMessages/create.controller";
import { updateReadyMessageController } from "./readyMessages/update.controller";
import { deleteReadyMessageController } from "./readyMessages/delete.controller";
import { getAllReadyMessagesController } from "./readyMessages/getAll.controller";
import { getOneReadyMessageByIdController } from "./readyMessages/getOneById.controller";

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
    wnumbers: {
        create: createWNumberController,
        delete: deleteWNumberController,
        getOneById: getOneNumberByIdController,
        update: updateNumberController
    },
    readyMessages: {
        create: createReadyMessageController,
        update: updateReadyMessageController,
        delete: deleteReadyMessageController,
        getAll: getAllReadyMessagesController,
        getOneById: getOneReadyMessageByIdController
    }
};

export default controllers;