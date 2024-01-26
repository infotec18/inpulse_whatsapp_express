import { Request, Response } from "express";
import services from "../../services";

export const getProdutividadeController = async (req: Request, res: Response) => {

    // if(!req.user.isAdmin) return res.status(401).json({ message: "No authorization" })

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    const { dados } = await services.users.getProdutividade(startDate, endDate);
  
    return res.status(201).json({ dados });
};