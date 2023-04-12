import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { AppDataSource } from "../../data-source";
import { AppError } from "../../errors";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";

export async function downloadReadyFileService(req: Request, res: Response) {

    const messagesFilesRepository = AppDataSource.getRepository(ReadyMessageFile);
    const file = await messagesFilesRepository.findOneBy({ CODIGO: Number(req.params.id)});

    if(!file) throw new AppError("File not found.", 404);

    const filePath = path.join(__dirname, `../../../files`, file.ARQUIVO);
    
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename=${file.ARQUIVO}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        return filePath;
        
    } else {
        throw new AppError("File not found.", 404);
    }
};