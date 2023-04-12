import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";

export async function getOneByIdNumberService(cod: number): Promise<Wnumber | null> {

    const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findNumber: Wnumber | null = await WnumberRepository.findOneBy({
        CODIGO: cod
    });

    return findNumber;
};