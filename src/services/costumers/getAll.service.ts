import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Costumer } from "../../entities/costumer.entity";

export async function getAllCostumersService(): Promise<Costumer[]> {
    const costumersRepository: Repository<Costumer> = AppDataSource.getRepository(Costumer);

    const findCostumers: Costumer[] = await costumersRepository.find();

    return findCostumers;
}
