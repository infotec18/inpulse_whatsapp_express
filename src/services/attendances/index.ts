import { findAttendanceService } from "./find.service";
import { createAttendanceService } from "./create.service";
import { findAttendancesByUserService } from "./findByOperator.service";
import { getOperatorForAttendance } from "./getOperatorForAttendance.service";
import { getAllRunningAttendancesService } from "./getAllRunningAttendances.service";
import { finishAttendanceService } from "./finish.service";

export const find = findAttendanceService;
export const create = createAttendanceService;
export const findByUser = findAttendancesByUserService;
export const getOperator = getOperatorForAttendance;
export const getAllRunning = getAllRunningAttendancesService;
export const finish = finishAttendanceService;