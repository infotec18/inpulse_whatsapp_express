import { findAttendanceService } from "./attendances/find.service";
import { getOneAvatarByUserIdService } from "./avatars/getOneByUserId.service";
import { insertUserAvatarService } from "./avatars/insert.service";
import { createCostumerService } from "./costumers/create.service";
import { getAllCostumersService } from "./costumers/getAll.service";
import { getLastCostumerIdService } from "./costumers/getLastId.service";
import { getOneCostumersService } from "./costumers/getOneById.service";
import { recoverCostumerService } from "./costumers/recover.service";
import { deleteCostumerService } from "./costumers/softDelete.service";
import { updateCostumerService } from "./costumers/update.service";
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
    costumers: {
        create: createCostumerService,
        getAll: getAllCostumersService,
        getOneById: getOneCostumersService,
        recover: recoverCostumerService,
        softDelete: deleteCostumerService,
        update: updateCostumerService,
        getLastId: getLastCostumerIdService
    }
};

export default services;