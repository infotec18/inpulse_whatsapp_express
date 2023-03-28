import { NextFunction, Request, Response } from "express";
import { Costumer } from "../../entities/costumer.entity";
import { AppError } from "../../errors";
import { getOneCostumersService } from "../../services/costumers/getOneById.service";

export async function ensureParamCostumerIdExists (req: Request, res: Response, next: NextFunction) {
    const userId: number = Number(req.params.userId);

    if(isNaN(userId)) throw new AppError("Invalid user id.", 400);

    const findCostumer: Costumer = await getOneCostumersService(userId);

    req.findCostumer = findCostumer;

    next();
}