import { Request, Response } from "express";
import services from "../../services";

export const getAllCustomersController = async (req: Request, res: Response) => {
    const limite = Number(req.query.limite) || 10;
    const pagina = Number(req.query.pagina) || 1;
    const search = String(req.query.search) || undefined;

    const { dados } = await services.customers.getAllCustomer(limite, pagina, search);


    return res.status(201).json({ dados });
};