import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";

export async function getAllCustomersService(limite: number, pagina: number) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const [ dados, total ] = await customersRepository
        .createQueryBuilder('clientes')
        .leftJoinAndSelect('clientes.TELEFONES', 'wn')
        .orderBy('clientes.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)
        .getManyAndCount()

    return { dados, total };
}
