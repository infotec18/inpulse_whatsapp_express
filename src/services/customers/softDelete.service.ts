import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";

export async function deleteCustomerService(customer: Customer): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const updateCustomer = await customersRepository.save({ ...customer, ATIVO: "NÃO" });

    return updateCustomer;
}