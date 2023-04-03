import { Request, Response } from "express";
import services from "../../services";

export const getAllCustomersController = async (req: Request, res: Response) => {
    const limite = Number(req.query.limite) || 10;
    const pagina = Number(req.query.pagina) || 1;

    const { dados, total } = await services.customers.getAll(limite, pagina);

    const totalPaginas = Math.ceil(total / limite);

    return res.status(201).json({ dados, total, totalPaginas });
};