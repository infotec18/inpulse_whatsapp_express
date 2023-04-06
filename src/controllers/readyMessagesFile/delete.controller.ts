import { Request, Response } from "express"
import services from "../../services"
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity"
import { AppError } from "../../errors";

export async function deleteReadyMessageFile(req: Request, res: Response): Promise<Response> {
    try {
        const codigo = parseInt(req.params.codigo);

        const deleteddReadyMessageFile = await services.readyMessageFile.delete(codigo);

        return res.status(200).json(deleteddReadyMessageFile);
    } catch (error) {
        throw new AppError(`Error updating message file: ${error}`, 400);
    }
}