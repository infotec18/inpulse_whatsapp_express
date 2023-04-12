import { Request, Response } from "express";
import { ReadyMessage } from "../../entities/readyMessage.entity";
import services from "../../services";

export const updateReadyMessageController = async (req: Request, res: Response) => {
    const updated: ReadyMessage = await services.readyMessages.update(req.findReadyMessage, req.body);

    return res.status(200).json(updated);
};