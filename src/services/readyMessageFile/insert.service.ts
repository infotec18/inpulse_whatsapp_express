import { Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";
import * as fs from 'fs-extra';
import * as path from 'path';

export async function insertFile( 
    req: Request
    ): Promise<ReadyMessageFile | null> {
        
    const { ARQUIVO, CODIGO_MENSAGEM, TIPO } = req.body;

    if (!ARQUIVO || !CODIGO_MENSAGEM || !TIPO) {
        return null;
    }

    try {
        const buffer = Buffer.from(ARQUIVO, 'base64');
        const uploadFolder = '../../../files';
        const ext = TIPO.split('/')[1];
        const fileName = `${Date.now()}_${CODIGO_MENSAGEM}.${ext}`;
        const filePath = path.join(__dirname, uploadFolder, fileName);

        await fs.ensureDir(uploadFolder);
        await fs.writeFile(filePath, buffer);

        const readyMessageFilesRepository = AppDataSource.getRepository(ReadyMessageFile);
        const newEntry = new ReadyMessageFile();

        newEntry.CODIGO_MENSAGEM = CODIGO_MENSAGEM;
        newEntry.TIPO = TIPO;
        newEntry.ARQUIVO = fileName;

        const savedEntry = await readyMessageFilesRepository.save(newEntry);

        return savedEntry;

    } catch (error) {
        console.error('Error saving file and storing path:', error);
        return null;
    }
}