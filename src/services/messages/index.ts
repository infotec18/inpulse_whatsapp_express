import { getAllMessagesByAttendanceService } from "./getAllByAttendance.service";
import { retrieveMessageService } from "./retrieve.service";
import { createMessageService } from "./create.service";
import { createOficialMessageService } from "./createOficial.service";

export const create = createMessageService;
export const retrieve = retrieveMessageService;
export const getAllByAttendance = getAllMessagesByAttendanceService;
export const createOficial = createOficialMessageService;