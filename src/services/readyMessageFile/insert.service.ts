import { Request } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";

export async function insert(req: Request) {
    const readyMessageFileRepository: Repository<ReadyMessageFile> = AppDataSource.getRepository(ReadyMessageFile);

    if(!!req.body){
        const existingReadyMessageFile = await readyMessageFileRepository.findOneBy({CODIGO_MENSAGEM: req.body.CODIGO_MENSAGEM});
    
        if(existingReadyMessageFile) throw new AppError("An archive is already assigned to this message", 401);
    
        const readyMessageFile = readyMessageFileRepository.create(req.body);
        await readyMessageFileRepository.save(readyMessageFile);
    
        return readyMessageFile;
    }

}