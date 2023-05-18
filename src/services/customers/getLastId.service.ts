import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { AppError } from "../../errors";

export async function getLastCustomerIdService(): Promise<number> {

    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const allCustomers: Customer[] = await customersRepository.find({
        order: {
            CODIGO: 'DESC'
        }
    });

    const lastCustomer: Customer | undefined = allCustomers[0];

    if (!lastCustomer) return 1

    return lastCustomer.CODIGO;
};