import { Request, Response } from "express";
import { Attendance } from "../../entities/attendance.entity";
import services from "../../services";

export const getSchedulesByUserIdController = async (req: Request, res: Response): Promise<Response<Attendance[]>> => {
    const userId = Number(req.params.userId);
    const userScheduledAttendances = await services.attendances.getUserSchedules(userId);

    return res.status(200).json(userScheduledAttendances);
};