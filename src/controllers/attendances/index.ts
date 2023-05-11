import { cancelAttendanceScheduleController } from "./cancelSchedule.controller";
import { getAllAttendances } from "./getAttendancesByType.controller";

export const getAllAttendancesByType = getAllAttendances;
export const cancelSchedule = cancelAttendanceScheduleController;