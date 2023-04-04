import { Request, Response } from "express";
import services from "../../services";

export const getOneReadyMessageByIdController = async (req: Request, res: Response) => {

    const findMessage = await services.readyMessages.getOneById(req.findReadyMessage.CODIGO);

    return res.status(200).json(findMessage);
};