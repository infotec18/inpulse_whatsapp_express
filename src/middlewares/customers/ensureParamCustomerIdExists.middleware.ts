import { NextFunction, Request, Response } from "express";
import { Customer } from "../../entities/customer";
import { AppError } from "../../errors";
import { getOneCustomersService } from "../../services/customers/getOneById.service";

export async function ensureParamCustomerIdExists (req: Request, res: Response, next: NextFunction) {
    const userId: number = Number(req.params.userId);

    if(isNaN(userId)) throw new AppError("Invalid user id.", 400);

    const findCustomer: Customer | null = await getOneCustomersService(userId);

    if(!findCustomer) throw new AppError("Customer not found", 404);

    req.findCustomer = findCustomer;

    next();
}