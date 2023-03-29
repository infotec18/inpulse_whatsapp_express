import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";

export async function recoverCustomerService(customer: Customer): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const updateCustomer = await customersRepository.save({ ...customer, ATIVO: "SIM" });

    return updateCustomer;
}