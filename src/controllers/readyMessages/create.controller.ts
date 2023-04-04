import { Request, Response } from "express";
import services from "../../services";

export const createReadyMessageController = async (req: Request, res: Response) => {
    const newMessage = await services.readyMessages.create(req.body);

    return res.status(201).json(newMessage);
}