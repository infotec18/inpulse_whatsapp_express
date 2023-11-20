import { Request, Response } from "express";
import services from "../../services";

export const getLastUserIdController = async (req: Request, res: Response) => {

    const dataAtual = new Date();
    const numeroDoDia = dataAtual.getDate();

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - (1000 * 60 * 60 * 24 * (numeroDoDia - 1 )));
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) :  new Date(Date.now())
    const {vendasPorEstado,operadores,motivos_pausa,VALOR_PROPOSTA_TOTAL} = await services.users.getLastId(startDate, endDate);

    return res.status(200).json({ vendasPorEstado,operadores,motivos_pausa,VALOR_PROPOSTA_TOTAL });
};