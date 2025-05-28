import { Request, Response } from "express";
import services from "../../services";

export const getAllUsersController = async (req: Request, res: Response) => {

    // if(!req.user.isAdmin) return res.status(401).json({ message: "No authorization" })

    const currentDate = new Date();
    const currentUTC = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
    const currentDateTimeMinus3 = new Date(currentUTC + (3600000 * -3));

    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : currentDateTimeMinus3;

    const yesterday = new Date(currentDateTimeMinus3);
    yesterday.setDate(currentDateTimeMinus3.getDate() - 1);
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

    const { dados } = await services.users.getAll(startDate, endDate);
  
    return res.status(200).json({ dados });
};