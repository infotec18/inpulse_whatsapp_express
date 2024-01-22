import { Request, Response } from "express";
import services from "../../services";

export const getHistoricoStatusController = async (req: Request, res: Response) => {

    // if(!req.user.isAdmin) return res.status(401).json({ message: "No authorization" })

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - (1000 * 60 * 60 * 24 * 1));
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(Date.now())
    const codigo_operador = req.query.codigo_operador ? req.query.codigo_operador  : 0;

    const { dados } = await services.users.getHistoricoStatus(startDate, endDate, Number(codigo_operador));
  
    return res.status(201).json({ dados });
};