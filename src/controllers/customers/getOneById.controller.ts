import { Request, Response } from "express";
import services from "../../services";

export const getOneCustomerByIdController = async (req: Request, res: Response) => {

    const findCustomer = await services.customers.getOneById(req.findCustomer.CODIGO);

    return res.status(200).json(findCustomer);
};