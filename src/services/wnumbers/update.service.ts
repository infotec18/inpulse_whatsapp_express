import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";

export async function updateWNumberService(number: Wnumber, newData: Partial<Wnumber>): Promise<Wnumber> {

    const numbersRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const updatedNumber = await numbersRepository.save({ ...number, ...newData });

    return updatedNumber;
};