import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { AppError } from "../../errors";

export async function getOneCustomersService(id: number): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const findCustomer: Customer | null = await customersRepository.findOneBy({
        CODIGO: id
    });

    if(!findCustomer) throw new AppError("Customer provided on token is not found.", 404);

    return findCustomer;
}
