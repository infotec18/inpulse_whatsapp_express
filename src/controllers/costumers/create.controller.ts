import { Request, Response } from "express";
import services from "../../services";

export const createCostumerController = async (req: Request, res: Response) => {
    const newCostumer = await services.costumers.create(req);

    return res.status(201).json(newCostumer);
}