import { Request, Response } from "express";
import services from "../../services";

export const sendTemplateVariablesController = async (req: Request, res: Response) => {
    const results = await services.whatsapp.sendTemplateVariables( req.body.variables , req.body.id_template,req.body.messege);
    return res.status(200).json(results);
};