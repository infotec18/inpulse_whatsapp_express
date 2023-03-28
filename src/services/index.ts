import { findAttendanceService } from "./attendances/find.service";
import { getOneAvatarByUserIdService } from "./avatars/getOneByUserId.service";
import { insertUserAvatarService } from "./avatars/insert.service";
import { createUserService } from "./users/create.service";
import { getAllUsersService } from "./users/getAll.service";
import { getLastUserIdService } from "./users/getLastId.service";
import { getOneUserByIdService } from "./users/getOneById.service";
import { loginUserService } from "./users/login.service";
import { recoverUserService } from "./users/recover.service";
import { softDeleteUserService } from "./users/softDelete.service";
import { updateUserService } from "./users/update.service";
import { findNumberService } from "./wnumbers/find.service";

const services = {
    users: {
        create: createUserService,
        getAll: getAllUsersService,
        getOneById: getOneUserByIdService,
        login: loginUserService,
        recover: recoverUserService,
        softDelete: softDeleteUserService,
        update: updateUserService,
        getLastId: getLastUserIdService
    },
    avatars: {
        insert: insertUserAvatarService,
        getOneById: getOneAvatarByUserIdService
    },
    wnumbers: {
        find: findNumberService
    },
    attendances: {
        find: findAttendanceService
    }
};

export default services;