import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { Wnumber } from "../../entities/wnumber.entity";

interface Contact {
    RAZAO: string;
    CONTATO: string;
    CPF_CNPJ: string;
    NUMERO: string;
};

export async function getContactsWithCompanyDetailsService () {
    const ClientsRepository = AppDataSource.getRepository(Customer);
    const NumbersRepository = AppDataSource.getRepository(Wnumber);

    const numbers = await NumbersRepository.find();
    const contacts: Array<Contact> = [];
    
    for (let number of numbers) {
        const client = await ClientsRepository.findOneBy({ CODIGO: number.CODIGO_CLIENTE});
        if(client) {
            contacts.push({
                CONTATO: number.NOME,
                RAZAO: client.RAZAO,
                CPF_CNPJ: client.CPF_CNPJ,
                NUMERO: number.NUMERO
            });
        };
    };
  
    return contacts
};

