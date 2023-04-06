import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity";
import { AppError } from "../../errors";
import { getOneById } from "./getOneById.service";

export async function deleleteReadyMessageFile(CODIGO: number): Promise<void> {
    const readyMessageFileRepository: Repository<ReadyMessageFile> = AppDataSource.getRepository(ReadyMessageFile);

    const readyMessageFile = await getOneById(CODIGO);

    await readyMessageFileRepository.remove(readyMessageFile);
}