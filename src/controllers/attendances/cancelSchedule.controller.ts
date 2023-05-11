import { Request, Response } from "express";
import services from "../../services";
import { AppError } from "../../errors";

export const cancelAttendanceScheduleController = async(req: Request, res: Response) => {
    const CODIGO_ATENDIMENTO = parseInt(req.params.attendanceId);

    if(isNaN(CODIGO_ATENDIMENTO)) throw new AppError("Parametro de rota errado, deve ser um número!", 400);

    const result = await services.attendances.cancelSchedule(CODIGO_ATENDIMENTO);

    return res.status(200).json({ message: result });
};