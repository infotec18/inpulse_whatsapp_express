import { Request, Response } from "express";
import services from "../../services";
import { Costumer } from "../../entities/costumer.entity";

export const recoverCostumerController = async (req: Request, res: Response) => {
    const recoveredCostumer: Costumer = await services.costumers.recover(req.findCostumer);

    return res.status(200).json(recoveredCostumer);
};