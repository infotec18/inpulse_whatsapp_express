import { Request, Response } from "express";
import services from "../../services";
import { createReadStream } from "fs";

export const downloadReadyFileController = async(req: Request, res: Response) => {
    const filePath = await services.readyMessageFile.download(req, res);

    return createReadStream(filePath).pipe(res);
};