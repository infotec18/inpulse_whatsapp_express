import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";

export async function findByCPFCNPJService(value: string): Promise<Customer | null> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const findCustomer: Customer | null = await customersRepository.findOneBy({
        CPF_CNPJ: value
    });

    return findCustomer;
}
