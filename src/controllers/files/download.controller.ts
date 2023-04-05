import { Request, Response } from "express";
import services from "../../services";
import { createReadStream } from "fs";

export const downloadFileController = async(req: Request, res: Response) => {
    const filePath = await services.files.download(req, res);

    return createReadStream(filePath).pipe(res);
};