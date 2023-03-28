import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Costumer } from "../../entities/costumer.entity";
import { AppError } from "../../errors";

export async function getLastCostumerIdService(): Promise<number> {

    const costumersRepository: Repository<Costumer> = AppDataSource.getRepository(Costumer);

    const allCostumers: Costumer[] = await costumersRepository.find({
        order: {
            CODIGO: 'DESC'
        }
    });

    const lastCostumer: Costumer | undefined = allCostumers[0];

    if (!lastCostumer) throw new AppError("No user found in the database.", 404);

    return lastCostumer.CODIGO;
};