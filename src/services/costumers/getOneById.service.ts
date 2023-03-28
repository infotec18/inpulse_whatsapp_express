import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Costumer } from "../../entities/costumer.entity";
import { AppError } from "../../errors";

export async function getOneCostumersService(id: number): Promise<Costumer> {
    const costumersRepository: Repository<Costumer> = AppDataSource.getRepository(Costumer);

    const findCostumer: Costumer | null = await costumersRepository.findOneBy({
        CODIGO: id
    });

    if(!findCostumer) throw new AppError("Costumer provided on token is not found.", 404);

    return findCostumer;
}
