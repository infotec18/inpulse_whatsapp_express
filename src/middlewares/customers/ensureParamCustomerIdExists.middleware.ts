import { NextFunction, Request, Response } from "express";
import { Customer } from "../../entities/customer";
import { AppError } from "../../errors";
import { getOneCustomersService } from "../../services/customers/getOneById.service";

export async function ensureParamCustomerIdExists (req: Request, res: Response, next: NextFunction) {
    const userId: number = Number(req.params.userId);

    if(isNaN(userId)) throw new AppError("Invalid user id.", 400);

    const findCustomer: Customer = await getOneCustomersService(userId);

    req.findCustomer = findCustomer;

    next();
}