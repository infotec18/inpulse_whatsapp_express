import { NextFunction, Request, Response } from "express";
import { Wnumber } from "../../entities/wnumber.entity";
import { AppError } from "../../errors";
import { getOneByIdNumberService } from "../../services/wnumbers/getOneById.service";

export async function ensureParamNumberIdExists (req: Request, res: Response, next: NextFunction) {
    const numberId: number = Number(req.params.numberId);

    if(isNaN(numberId)) throw new AppError("Invalid user id.", 400);

    const findNumber: any = await getOneByIdNumberService(numberId.toString());

    req.findNumber = findNumber;

    next();
}