import { createUserService } from "./users/create.service";
import { getAllUsersService } from "./users/getAll.service";
import { getOneUserByIdService } from "./users/getOneById.service";
import { loginUserService } from "./users/login.service";

const services = {
    users: {
        create: createUserService,
        getAll: getAllUsersService,
        getOneById: getOneUserByIdService,
        login: loginUserService
    }
};

export default services;