import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";

export async function getAllCustomersService(limite: number, pagina: number, search: string | undefined) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const customersQuery = await customersRepository
        .createQueryBuilder('v_operadores_status')
        
    const [dados] = await customersQuery.getManyAndCount();

    return { dados};
};
