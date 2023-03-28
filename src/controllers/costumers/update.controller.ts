import { Request, Response } from "express";
import { Costumer } from "../../entities/costumer.entity";
import services from "../../services";

export const updateCostumerController = async (req: Request, res: Response) => {
    const updated: Costumer = await services.costumers.update(req.findCostumer, req.body);

    return res.status(200).json(updated);
};