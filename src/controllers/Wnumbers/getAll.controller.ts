import { Request, Response } from "express";
import services from "../../services";

export const getAllWNumbersController = async (req: Request, res: Response) => {
    const limite = Number(req.query.limite) || 10;
    const pagina = Number(req.query.pagina) || 1;
    const search = req.query.search?.toString() || undefined;

    const { dados, total } = await services.wnumbers.getAllWNumbers(limite, pagina, search);

    const totalPaginas = Math.ceil(total / limite);

    return res.status(201).json({ dados, total, totalPaginas });
};