import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";
import { AppError } from "../../errors";

export async function findNumberService(wpp: string): Promise<Wnumber | null> {

    const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findNumber: Wnumber | null = await WnumberRepository.findOneBy({
        NUMERO: wpp
    });

    return findNumber;
};