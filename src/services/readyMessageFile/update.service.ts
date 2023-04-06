import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";
import { getOneById } from "./getOneById.service";

export async function update(CODIGO: number, newData: Partial<Omit<ReadyMessageFile, "CODIGO">>): Promise<ReadyMessageFile> {
    const readyMessageFileRepository: Repository<ReadyMessageFile> = AppDataSource.getRepository(ReadyMessageFile);

    const readyMessageFile = await getOneById(CODIGO);

    const updatedReadyMessageFile = await readyMessageFileRepository.save({...readyMessageFile, ...newData});

    return updatedReadyMessageFile;
}