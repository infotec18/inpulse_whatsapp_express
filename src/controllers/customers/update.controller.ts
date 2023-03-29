import { Request, Response } from "express";
import { Customer } from "../../entities/customer";
import services from "../../services";

export const updateCustomerController = async (req: Request, res: Response) => {
    const updated: Customer = await services.customers.update(req.findCustomer, req.body);

    return res.status(200).json(updated);
};