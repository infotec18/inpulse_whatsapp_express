import { Request, Response } from "express";
import services from "../../services";

export const receiveWhatsappMessageController = async (req: Request, res: Response) => {
    const body = req.body
    
    await services.whatsapp.receiveMessage(body);

    return res.status(200).send();
};