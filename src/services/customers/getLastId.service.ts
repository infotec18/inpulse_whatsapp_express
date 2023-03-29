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

    if (!lastCustomer) throw new AppError("No user found in the database.", 404);

    return lastCustomer.CODIGO;
};