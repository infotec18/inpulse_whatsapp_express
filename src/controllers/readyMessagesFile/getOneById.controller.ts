import { Request, Response } from "express"
import services from "../../services"
import { AppError } from "../../errors";

export async function getOneReadyMessageFileById(req: Request, res: Response): Promise<Response> {
    try {
        const codigo = parseInt(req.params.id);
        const readyMessageFile = await services.readyMessageFile.getOneById(codigo);

        return res.status(200).json(readyMessageFile);
    } catch (error) {
        throw new AppError(`Error getting message file by ID: ${error}`, 400);
    }
}