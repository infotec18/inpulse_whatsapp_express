import { Request, Response } from "express";
import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";

export async function createCustomerService(req: Request): Promise<Customer> {
    const n = new Date();
    const DATA_CAD = `${n.getFullYear()}-${n.getMonth()}-${n.getDate()} ${n.getHours()}:${n.getMinutes()}`;

    const lastId = await services.customers.getLastId();

    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const newCustomer = await customersRepository.save({...req.body, CODIGO: lastId + 1, DATA_CAD });

    return newCustomer;
}