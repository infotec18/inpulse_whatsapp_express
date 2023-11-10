import { Request, Response } from "express";
import services from "../../services";

export const getLastUserIdController = async (req: Request, res: Response) => {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - (1000 * 60 * 60 * 24 * 1));
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(Date.now() + (1000 * 60 * 60 * 24 * 1))

    const {vendasPorEstado,operadores,motivos_pausa}= await services.users.getLastId(startDate, endDate);

    return res.status(200).json({ vendasPorEstado,operadores,motivos_pausa });
};