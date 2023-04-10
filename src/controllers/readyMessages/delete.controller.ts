import { Request, Response } from "express";
import services from "../../services";

export const deleteReadyMessageController = async (req: Request, res: Response) => {
    const getMessage = await services.readyMessages.delete(Number(req.params.messageId));

    return res.status(201).json(getMessage);
}