import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";

export async function getAllCustomersService(limite: number, pagina: number, search: string | undefined) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

    const customersQuery = await customersRepository
        .createQueryBuilder('clientes')
        .leftJoinAndSelect('clientes.TELEFONES', 'wn')
        .orderBy('clientes.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)
        
    if(search){
        customersQuery.where('clientes.CPF_CNPJ LIKE :search', {search: `%${search}%`})
    }

    const [dados, total] = await customersQuery.getManyAndCount();

    return { dados, total };
}
