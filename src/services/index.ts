import { findAttendanceService } from "./attendances/find.service";
import { createAttendanceService } from "./attendances/create.service";
import { createNumberService } from "./wnumbers/create.service";
import { getOneAvatarByUserIdService } from "./avatars/getOneByUserId.service";
import { insertUserAvatarService } from "./avatars/insert.service";
import { createCustomerService } from "./customers/create.service";
import { getAllCustomersService } from "./customers/getAll.service";
import { getLastCustomerIdService } from "./customers/getLastId.service";
import { getOneCustomersService } from "./customers/getOneById.service";
import { recoverCustomerService } from "./customers/recover.service";
import { deleteCustomerService } from "./customers/softDelete.service";
import { updateCustomerService } from "./customers/update.service";
import { createUserService } from "./users/create.service";
import { getAllUsersService } from "./users/getAll.service";
import { getLastUserIdService } from "./users/getLastId.service";
import { getOneUserByIdService } from "./users/getOneById.service";
import { loginUserService } from "./users/login.service";
import { recoverUserService } from "./users/recover.service";
import { softDeleteUserService } from "./users/softDelete.service";
import { updateUserService } from "./users/update.service";
import { getOneByIdNumberService } from "./wnumbers/getOneById.service";
import { findAttendancesByUserService } from "./attendances/findByOperator.service";
import { findByCPFCNPJ } from "./customers/findByCPF.service";
import { directCreateCustomerService } from "./customers/directCreate.service";
import { updateWNumberService } from "./wnumbers/update.service";
import { deleteWNumberService } from "./wnumbers/delete.service";
import { createMessageService } from "./messages/create.service";
import { getOperatorForAttendance } from "./attendances/getOperatorForAttendance.service";
import { retrieveMessageService } from "./messages/retrieve.service";
import { getAllRunningAttendancesService } from "./attendances/getAllRunningAttendances.service";
import { getAllMessagesByAttendanceService } from "./messages/getAllByAttendance.service";
import { downloadFileService } from "./files/download.service";
import { returnBase64Service } from "./files/returnBase64.service";
import { findNumberService } from "./wnumbers/find.service";
import { insertReadyMessageService } from "./readyMessages/insertMessage.service";
import { updateReadyMessagesService } from "./readyMessages/updateMessage.service";
import { deleteReadyMessageService } from "./readyMessages/deleteMessage.service";
import { getAllReadyMessagesService } from "./readyMessages/getAllMessages.service";
import { getOneReadyMessageService } from "./readyMessages/getOneById.service";
import { saveFileLocallyService } from "./files/saveLocally.service";

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
        find: findNumberService,
        getById: getOneByIdNumberService,
        create: createNumberService,
        update: updateWNumberService,
        delete: deleteWNumberService
    },
    attendances: {
        find: findAttendanceService,
        create: createAttendanceService,
        findByUser: findAttendancesByUserService,
        getOperator: getOperatorForAttendance,
        getAllRunning: getAllRunningAttendancesService
    },
    customers: {
        directCreate: directCreateCustomerService,
        create: createCustomerService,
        getAll: getAllCustomersService,
        getOneById: getOneCustomersService,
        recover: recoverCustomerService,
        softDelete: deleteCustomerService,
        update: updateCustomerService,
        getLastId: getLastCustomerIdService,
        findByCPFCNPJ: findByCPFCNPJ
    },
    messages: {
        create: createMessageService,
        retrieve: retrieveMessageService,
        getAllByAttendance: getAllMessagesByAttendanceService
    },
    files: {
        download: downloadFileService,
        returnBase64: returnBase64Service,
        retrieve: retrieveMessageService,
        saveLocally: saveFileLocallyService
    },
    readyMessages: {
        create: insertReadyMessageService,
        update: updateReadyMessagesService,
        delete: deleteReadyMessageService,
        getAll: getAllReadyMessagesService,
        getOneById: getOneReadyMessageService
    }
};

export default services;