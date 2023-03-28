import { Request, Response } from "express";
import services from "../../services";
import { Costumer } from "../../entities/costumer.entity";

export const deleteCostumerController = async (req: Request, res: Response) => {
    const costumer: Costumer = await services.costumers.softDelete(req.findCostumer);

    return res.status(200).json(costumer);
}