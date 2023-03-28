import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";
import { AppError } from "../../errors";

export async function findNumberService(wpp: string): Promise<Wnumber> {

    const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findNumber: Wnumber | null = await WnumberRepository.findOneBy({
        NUMERO: wpp
    });

    if(!findNumber) throw new AppError("Didn't find number.", 404);

    return findNumber;
};