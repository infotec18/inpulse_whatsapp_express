import { NextFunction, Request, Response } from "express";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import { getOneUserByIdService } from "../../services/users/getOneById.service";

export async function ensureParamUserIdExists (req: Request, res: Response, next: NextFunction) {
    const userId: number = Number(req.params.userId);

    if(isNaN(userId)) throw new AppError("Invalid user id.", 400);

    const findUser: User = await getOneUserByIdService(userId);

    req.findUser = findUser;

    next();
}