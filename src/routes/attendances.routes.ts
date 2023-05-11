import { Router } from "express";
import controllers from "../controllers";

export const attendancesRoute = Router();

attendancesRoute.get('/attendances/',
    controllers.attendances.getAllAttendancesByType
);

attendancesRoute.put('/attendances/:attendanceId/schedule',
    controllers.attendances.cancelSchedule
);