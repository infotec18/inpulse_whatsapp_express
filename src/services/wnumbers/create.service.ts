import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";

export async function createNumberService(wpp: string): Promise<void> {

  const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

  await WnumberRepository.create({
      NUMERO: wpp
  });
};