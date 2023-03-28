import { Request, Response } from "express";
import services from "../../services";

export const getAllCostumersController = async (req: Request, res: Response) => {
    const newCostumer = await services.costumers.getAll();

    return res.status(201).json(newCostumer);
};