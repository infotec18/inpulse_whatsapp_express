import { Repository } from "typeorm";
import { Costumer } from "../../entities/costumer.entity";
import { AppDataSource } from "../../data-source";

export async function recoverCostumerService(costumer: Costumer): Promise<Costumer> {
    const costumersRepository: Repository<Costumer> = AppDataSource.getRepository(Costumer);

    const updateCostumer = await costumersRepository.save({ ...costumer, ATIVO: "SIM" });

    return updateCostumer;
}