import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import { MotivoDesativacaoCliente } from "../../entities/MotivoDesativacaoCliente";
import { User } from "../../entities/user.entity";

export async function softDeleteCustomerService(cliente: Customer, motivo: string, operador: User) {
    const TABELA_CLIENTES: Repository<Customer> = AppDataSource.getRepository(Customer);
    const TABELA_MOTIVOS: Repository<MotivoDesativacaoCliente> = AppDataSource.getRepository(MotivoDesativacaoCliente);

    cliente.ATIVO = "NAO";

    const MOTIVO = TABELA_MOTIVOS.create({
        CLIENTE: cliente.CODIGO,
        DATAHORA: Date.now(),
        MOTIVO: motivo,
        OPERADOR: operador.CODIGO
    });

    await TABELA_CLIENTES.save(cliente);
    await TABELA_MOTIVOS.save(MOTIVO);

    return;
};