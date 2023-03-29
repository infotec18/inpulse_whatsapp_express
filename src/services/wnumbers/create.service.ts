import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";
import { NewNumberParams } from "../../interfaces/wnumbers.interfaces";

export async function createNumberService(params: NewNumberParams): Promise<Wnumber> {

  const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);
  const newNumber = await WnumberRepository.save({ ...params });

  return newNumber;
};