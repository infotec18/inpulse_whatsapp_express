import { Request, Response } from "express";
import services from "../../services";

export const getByOperatorIdController = async (req: Request, res: Response) => {

    const customers = await services.customers.findByOperatorId(Number(req.findUser.CODIGO));

    return res.status(201).json(customers);
};