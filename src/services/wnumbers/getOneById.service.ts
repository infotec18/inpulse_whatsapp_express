import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";
import { AppError } from "../../errors";

export async function getOneNumberByIdService(cod: number): Promise<Wnumber | null> {

    const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findNumber: Wnumber | null = await WnumberRepository.findOneBy({
        CODIGO: cod
    });

    if(!findNumber) throw new AppError("Number not found", 404);

    return findNumber;
};