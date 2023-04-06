import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";

export async function getOneById(CODIGO: number): Promise<ReadyMessageFile> {
    const readyMessageFileRepository: Repository<ReadyMessageFile> = AppDataSource.getRepository(ReadyMessageFile);

    const readyMessageFile = await readyMessageFileRepository.findOne({ where: { CODIGO } });

    if(!readyMessageFile) throw new AppError("Message file not found", 404);

    return readyMessageFile;
}