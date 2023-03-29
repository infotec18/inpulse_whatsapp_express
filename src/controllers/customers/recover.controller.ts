import { Request, Response } from "express";
import services from "../../services";
import { Customer } from "../../entities/customer";

export const recoverCustomerController = async (req: Request, res: Response) => {
    const recoveredCustomer: Customer = await services.customers.recover(req.findCustomer);

    return res.status(200).json(recoveredCustomer);
};