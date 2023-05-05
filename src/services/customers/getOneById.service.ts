import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { AppError } from "../../errors";

export async function getOneCustomersService(id: number): Promise<Customer | null> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const findCustomer: Customer | null = await customersRepository.findOneBy({
        CODIGO: id
    });

    return findCustomer;
}
