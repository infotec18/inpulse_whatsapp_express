import { Request, Response } from "express";
import { Repository } from "typeorm";
import { Costumer } from "../../entities/costumer.entity";
import { AppDataSource } from "../../data-source";

export async function createCostumerService(req: Request): Promise<Costumer> {
    const costumersRepository: Repository<Costumer> = AppDataSource.getRepository(Costumer);

    const newCostumer = await costumersRepository.save({...req.body});

    return newCostumer;
}