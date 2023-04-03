import { Request, Response } from "express";
import { Wnumber } from "../../entities/wnumber.entity";
import services from "../../services";

export const updateNumberController = async (req: Request, res: Response) => {
    const updated: Wnumber = await services.wnumbers.update(req.findNumber, req.body);

    return res.status(200).json(updated);
};