import { Request, Response } from "express"
import services from "../../services"
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity"
import { AppError } from "../../errors";

export async function updateReadyMessageFile(req: Request, res: Response): Promise<Response> {
    try {
        const codigo = parseInt(req.params.codigo);

        const data: Partial<Omit<ReadyMessageFile, "CODIGO">> = req.body;

        const updatedReadyMessageFile = await services.readyMessageFile.update(codigo, data);

        return res.status(200).json(updatedReadyMessageFile);
    } catch (error) {
        throw new AppError(`Error updating message file: ${error}`, 400);
    }
}