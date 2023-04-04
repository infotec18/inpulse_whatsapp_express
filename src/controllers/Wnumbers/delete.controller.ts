import { Request, Response } from "express";
import services from "../../services";

export const deleteWNumberController = async (req: Request, res: Response) => {
    const getNumber = await services.wnumbers.delete(Number(req.query.id));

    return res.status(201).json(getNumber);
}