import { createUserService } from "./users/create.service";
import { getAllUsersService } from "./users/getAll.service";
import { getOneUserByIdService } from "./users/getOneById.service";
import { loginUserService } from "./users/login.service";
import { recoverUserService } from "./users/recover.service";
import { softDeleteUserService } from "./users/softDelete.service";

const services = {
    users: {
        create: createUserService,
        getAll: getAllUsersService,
        getOneById: getOneUserByIdService,
        login: loginUserService,
        recover: recoverUserService,
        softDelete: softDeleteUserService
    }
};

export default services;