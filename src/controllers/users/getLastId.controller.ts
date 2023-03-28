import { Request, Response } from "express";
import services from "../../services";

export const getLastUserIdController = async (req: Request, res: Response) => {
    const lastId: number = await services.users.getLastId();

    return res.status(200).json({ lastId });
};