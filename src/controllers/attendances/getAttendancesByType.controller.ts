import { Request, Response } from "express";
import services from "../../services";

export const getAllAttendances = async (req: Request, res: Response) => {
    const results = await services.attendances.getAllByStatus(req);

    return res.status(200).json(results);
}