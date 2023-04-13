import { findAttendanceService } from "./find.service";
import { createAttendanceService } from "./create.service";
import { findAttendancesByUserService } from "./findByOperator.service";
import { getOperatorForAttendance } from "./getOperatorForAttendance.service";
import { getAllRunningAttendancesService } from "./getAllRunningAttendances.service";
import { finishAttendanceService } from "./finish.service";
import { getSchedulesByUserIdService } from "./getSchedulesByUserId.service";
import { updateSchedulingDate } from "./updateAttendance.service";

export const find = findAttendanceService;
export const create = createAttendanceService;
export const findByUser = findAttendancesByUserService;
export const getOperator = getOperatorForAttendance;
export const getAllRunning = getAllRunningAttendancesService;
export const finish = finishAttendanceService;
export const getUserSchedules = getSchedulesByUserIdService;
export const updateSchedulesDate = updateSchedulingDate;
