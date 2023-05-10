import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";
import { CustomerRegistrationData } from "../../interfaces/attendances.interfaces";
import { Origin } from "../../entities/origin.entity";

export async function directCreateCustomerService(params: CustomerRegistrationData): Promise<Customer> {
    
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const originsRepository: Repository<Origin> = AppDataSource.getRepository(Origin);
    
    const lastId = await services.customers.getLastId();

    const DATACAD = new Date();
    const { RAZAO, CPF_CNPJ } = params;

    const PESSOA = CPF_CNPJ!.length === 11 ? "FIS" : "JUR";

    const findOrigin = await originsRepository.findOneBy({ DESCRICAO: "WHATSAPP" });
    let ORIGEM;

    if(!findOrigin) {
        const allOriginsDesc = await originsRepository.find({
            order: {
                CODIGO: 'DESC'
            }
        });
        const lastOriginId = allOriginsDesc[0];

        const newOrigin = await originsRepository.save({
            CODIGO: lastOriginId.CODIGO + 1,
            DESCRICAO: "WHATSAPP"
        });

        ORIGEM = newOrigin.CODIGO;
    } else {
        ORIGEM = findOrigin.CODIGO
    };

    const newCustomer = customersRepository.save({ 
        CODIGO: lastId + 1,
        RAZAO: RAZAO!, 
        PESSOA: PESSOA,
        CPF_CNPJ: CPF_CNPJ!, 
        DATACAD, 
        DESC_FONE1: "WHATSAPP", 
        ATIVO: "SIM", 
        ORIGEM,
        COD_ERP: null
    });

    return newCustomer;
};