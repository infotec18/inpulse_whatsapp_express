import { Request, Response } from "express";
import services from "../../services";

export const createWNumberController = async (req: Request, res: Response) => {
    const newNumber = await services.wnumbers.create(req.body);

    return res.status(201).json(newNumber);
}