import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";
import * as path from 'path';
import { existsSync, readFileSync } from "fs";

export async function getOneById(CODIGO: number) {
    const readyMessageFileRepository: Repository<ReadyMessageFile> = AppDataSource.getRepository(ReadyMessageFile);

    const readyMessageFile = await readyMessageFileRepository.findOneBy({ CODIGO: CODIGO });

    if(!readyMessageFile) {
        await readyMessageFileRepository.save({
            CODIGO: CODIGO
        });

        return "não achei 1";
    } else if(!readyMessageFile.ARQUIVO){
        return "não achei 2";
    } else {
        const filePath = path.join(__dirname, `../../../files/`, readyMessageFile.ARQUIVO);
        
        if(readyMessageFile.ARQUIVO && existsSync(filePath)) {  
            const data = readFileSync(filePath);
            const base64 = Buffer.from(data).toString('base64');
            const dataUrl = `data:${readyMessageFile.TIPO};base64,${base64}`;
                
            return dataUrl
        } else {
            return "NÃO ACHEI 3";
        }
    };
}