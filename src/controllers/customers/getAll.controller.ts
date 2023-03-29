import { Request, Response } from "express";
import services from "../../services";

export const getAllCustomersController = async (req: Request, res: Response) => {
    const newCustomer = await services.customers.getAll();

    return res.status(201).json(newCustomer);
};