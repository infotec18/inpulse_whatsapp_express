import { Request, Response } from "express";
import services from "../../services";

export const recoverWhatsappMessageTemplatesController = async (req: Request, res: Response) => {
    const data = await services.whatsapp.recoverMessageTemplates();

    return res.status(200).json(data);
};