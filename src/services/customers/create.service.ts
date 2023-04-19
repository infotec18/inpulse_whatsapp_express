import { Request } from "express";
import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";
import { AppError } from "../../errors";

export async function createCustomerService(req: Request): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
   
    const existsCustomer = await customersRepository.findOneBy({CPF_CNPJ: req.body.CPF_CNPJ});

    if(!!existsCustomer) throw new AppError("Não é possível registrar esse CNPJ pois já existe.", 400);
   
    const n = new Date();
    const DATA_CAD = `${n.getFullYear()}-${n.getMonth()}-${n.getDate()} ${n.getHours()}:${n.getMinutes()}`;

    const lastId = await services.customers.getLastId();


    const newCustomer = await customersRepository.save({...req.body, CODIGO: lastId + 1, DATA_CAD });

    return newCustomer;
};