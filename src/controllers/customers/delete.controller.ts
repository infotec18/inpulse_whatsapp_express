import { Request, Response } from "express";
import services from "../../services";
import { Customer } from "../../entities/customer";

export const deleteCustomerController = async (req: Request, res: Response) => {
    console.log(req.findCustomer)
    const customer = await services.customers.softDelete(req.findCustomer);

    return res.status(200).json(customer);
}