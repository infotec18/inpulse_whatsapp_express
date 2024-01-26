import { Request, Response } from "express";
import services from "../../services";

export const getAllUsersController = async (req: Request, res: Response) => {

    // if(!req.user.isAdmin) return res.status(401).json({ message: "No authorization" })

    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now());
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date(Date.now())

    const { dados } = await services.users.getAll(startDate, endDate);
  
    return res.status(201).json({ dados });
};