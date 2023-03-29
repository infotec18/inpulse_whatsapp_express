import { Request, Response } from "express";
import services from "../../services";

export const createCustomerController = async (req: Request, res: Response) => {
    const newCustomer = await services.customers.create(req);

    return res.status(201).json(newCustomer);
}