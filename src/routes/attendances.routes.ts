import { Router } from "express";
import controllers from "../controllers";

export const attendancesRoute = Router();

attendancesRoute.get('/api/attendances/',
    controllers.attendances.getAllAttendancesByType
)