import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";

export async function getAllCustomersService(): Promise<Customer[]> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const findCustomers: Customer[] = await customersRepository.find();

    return findCustomers;
}
