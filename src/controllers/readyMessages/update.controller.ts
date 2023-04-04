import { Request, Response } from "express";
import { ReadyMessages } from "../../entities/readyMessages.entity";
import services from "../../services";

export const updateReadyMessageController = async (req: Request, res: Response) => {
    const updated: ReadyMessages = await services.readyMessages.update(req.findReadyMessage, req.body);

    return res.status(200).json(updated);
};