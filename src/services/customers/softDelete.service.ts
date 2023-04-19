import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";

export async function deleteCustomerService(customer: Customer) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    await customersRepository.remove(customer);
}