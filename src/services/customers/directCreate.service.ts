import { Request, Response } from "express";
import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";
import { CustomerRegistrationData } from "../../interfaces/attendances.interfaces";

export async function directCreateCustomerService(params: CustomerRegistrationData): Promise<Customer> {
    const DATACAD = new Date();

    const lastId = await services.customers.getLastId();

    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const newCustomer = await customersRepository.save({...params, CODIGO: lastId + 1, DATACAD, COD_ERP: null });

    return newCustomer;
};