import { Request, Response } from "express";
import services from "../../services";

export const getAllResultsFromWhatsappController = async (req: Request, res: Response) => {
    const results = await services.results.getAllFromWhatsapp();

    return res.status(200).json(results);
};