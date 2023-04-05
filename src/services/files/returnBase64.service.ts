import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { AppDataSource } from "../../data-source";
import { MessageFile } from "../../entities/messageFile.entity";
import { AppError } from "../../errors";

export async function returnBase64Service(req: Request, res: Response) {

    const messagesFilesRepository = AppDataSource.getRepository(MessageFile);
    const file = await messagesFilesRepository.findOneBy({ CODIGO: Number(req.params.id)});

    if(!file) throw new AppError("File not found.", 404);

    const filePath = path.join(__dirname, `../../../files/messages`, file.ARQUIVO);

    if (fs.existsSync(filePath)) {

        fs.readFile(filePath, (err, data) => {
            if (err) throw err;
            const base64 = Buffer.from(data).toString('base64');

            return res.status(200).json({ base64 });
        });

    } else {
        throw new AppError("File not found.", 404);
    };
};