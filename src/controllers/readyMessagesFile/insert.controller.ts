import { Request, Response } from "express"
import services from "../../services"
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity"
import { AppError } from "../../errors";

export async function insertReadyMessageFile(req: Request, res: Response): Promise<Response> {
    try {
        const newReadyMessageFile = await services.readyMessageFile.insert(req);

        return res.status(201).json(newReadyMessageFile);
    } catch (error) {
        throw new AppError(`Error creating message file: ${error}`, 400);
    }
}