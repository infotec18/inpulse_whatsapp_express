import { NextFunction, Request, Response } from "express";
import { ReadyMessages } from "../../entities/readyMessages.entity";
import { AppError } from "../../errors";
import { getOneReadyMessageService } from "../../services/readyMessages/getOneById.service";

export async function ensureParamReadyMessagesIdExists (req: Request, res: Response, next: NextFunction) {
    const messageId: number = Number(req.params.messageId);

    if(isNaN(messageId)) throw new AppError("Invalid user id.", 400);

    const findMessage: ReadyMessages = await getOneReadyMessageService(messageId);

    req.findReadyMessage = findMessage;

    next();
}