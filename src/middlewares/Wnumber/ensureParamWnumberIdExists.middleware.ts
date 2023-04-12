import { NextFunction, Request, Response } from "express";
import { Wnumber } from "../../entities/wnumber.entity";
import { AppError } from "../../errors";
import { getOneByIdNumberService } from "../../services/wnumbers/getOneById.service";
import services from "../../services";

export async function ensureParamNumberIdExists (req: Request, res: Response, next: NextFunction) {
    const numberId: number = Number(req.params.numberId);

    if(isNaN(numberId)) throw new AppError("Invalid user id.", 400);

    const findNumber: any = await services.wnumbers.getById(Number(req.params.numberId));

    if(!findNumber) throw new AppError("Number not found", 404);
    
    req.findNumber = findNumber;

    next();
}