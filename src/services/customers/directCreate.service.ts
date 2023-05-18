import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";
import { CustomerRegistrationData } from "../../interfaces/attendances.interfaces";
import { Origin } from "../../entities/origin.entity";
import { find } from "node-emoji";
import { Wparameter } from "../../entities/whatsappParameter";
import { Campanha } from "../../entities/campanha.entity";
import { ClientCampaign } from "../../entities/clientCampaign.entity";

export async function directCreateCustomerService(params: CustomerRegistrationData, numero: string): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const originsRepository: Repository<Origin> = AppDataSource.getRepository(Origin);
    const whatsappParametros: Repository<Wparameter> = AppDataSource.getRepository(Wparameter);
    const campanhasRepository: Repository<Campanha> = AppDataSource.getRepository(Campanha);
    const CCRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    
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

    const newCustomer = await customersRepository.save({ 
        CODIGO: lastId ? lastId + 1 : 1,
        RAZAO: RAZAO!, 
        PESSOA: PESSOA,
        CPF_CNPJ: CPF_CNPJ!, 
        DATACAD, 
        DESC_FONE1: "WHATSAPP", 
        ATIVO: "SIM", 
        ORIGEM,
        COD_ERP: null
    });


    if(newCustomer) {
        const UNIDADE = await whatsappParametros.findOneBy({
            NOME: "UNIDADE_NOVO_CLIENTE"
        });

        const CAMPANHA = UNIDADE && await campanhasRepository.findOneBy({
            UNIDADE: Number(UNIDADE.VALOR),
            TIPO: "PROSPE"
        });

        const NOVO_CLIENTE_AGENDAMENTO = await whatsappParametros.findOneBy({
            NOME: "AGENDAMENTO_NOVO_CLIENTE_DIAS"
        });

        const newDate = new Date();

        if(NOVO_CLIENTE_AGENDAMENTO) {
            newDate.setDate(newDate.getDate() + Number(NOVO_CLIENTE_AGENDAMENTO));
        } else {
            newDate.setDate(newDate.getDate() + 3);
        };

        await CCRepository.save({
            CAMPANHA: CAMPANHA?.CODIGO || 4,
            CLIENTE: newCustomer.CODIGO,
            CONCLUIDO: "NAO",
            DT_AGENDAMENTO: newDate,
            OPERADOR: 0,
            FONE1: numero
        });
    };

    return newCustomer;
};