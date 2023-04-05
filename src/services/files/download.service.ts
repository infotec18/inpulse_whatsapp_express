import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { AppDataSource } from "../../data-source";
import { MessageFile } from "../../entities/messageFile.entity";
import { AppError } from "../../errors";

export async function downloadFileService(req: Request, res: Response) {

    const messagesFilesRepository = AppDataSource.getRepository(MessageFile);
    const file = await messagesFilesRepository.findOneBy({ CODIGO: Number(req.params.id)});

    if(!file) throw new AppError("File not found.", 404);

    const filePath = path.join(__dirname, `../../../files/messages`, file.ARQUIVO);
    
    if (fs.existsSync(filePath)) {
        console.log("foi3");
        res.setHeader('Content-Disposition', `attachment; filename=${file.ARQUIVO}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        return filePath;
        
    } else {
        throw new AppError("File not found.", 404);
    }
};