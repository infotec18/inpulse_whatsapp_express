import { Request, Response } from "express";
import services from "../../services";

export const getLastCostumerIdController = async (req: Request, res: Response) => {
    const lastId: number = await services.costumers.getLastId();

    return res.status(200).json({ lastId });
};