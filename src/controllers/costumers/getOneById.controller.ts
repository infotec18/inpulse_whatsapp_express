import { Request, Response } from "express";
import services from "../../services";

export const getOneCostumerByIdController = async (req: Request, res: Response) => {

    const findCostumer = await services.costumers.getOneById(req.findCostumer.CODIGO);

    return res.status(200).json(findCostumer);
};