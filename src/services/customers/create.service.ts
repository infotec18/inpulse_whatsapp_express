import { Request } from "express";
import { Repository } from "typeorm";
import { Customer } from "../../entities/customer";
import { AppDataSource } from "../../data-source";
import services from "..";
import { AppError } from "../../errors";
import { Origin } from "../../entities/origin.entity";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Wparameter } from "../../entities/whatsappParameter";
import { Attendance } from "../../entities/attendance.entity";
import { Campanha } from "../../entities/campanha.entity";

export async function createCustomerService(req: Request): Promise<Customer> {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const originsRepository: Repository<Origin> = AppDataSource.getRepository(Origin);
    const CCRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const whatsappParametros: Repository<Wparameter> = AppDataSource.getRepository(Wparameter);
    const attendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const campanhasRepository: Repository<Campanha> = AppDataSource.getRepository(Campanha);
   
    const existsCustomer = await customersRepository.findOneBy({CPF_CNPJ: req.body.CPF_CNPJ});

    if(!!existsCustomer) throw new AppError("Este CPF/CNPJ já possuí um cadastro.", 400);
   
    const DATACAD = new Date();
    const lastId = await services.customers.getLastId();

    const { 
        RAZAO,
        FANTASIA,
        CPF_CNPJ, 
        NUMERO 
    } = req.body;

    const NUMERO_WITHOUT_MINUS = NUMERO.replace("+", "");
    const AREA1 = NUMERO_WITHOUT_MINUS.slice(2, 4);
    const FONE1 = NUMERO_WITHOUT_MINUS.slice(4);
    const PESSOA = CPF_CNPJ.length === 11 ? "FIS" : "JUR";

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
        ORIGEM = findOrigin.CODIGO;
    };

    const newCustomer = await customersRepository.save({ 
        CODIGO: lastId + 1, 
        RAZAO, 
        FANTASIA, 
        PESSOA, 
        CPF_CNPJ, 
        DATACAD, 
        AREA1, 
        FONE1, 
        DESC_FONE1: "WHATSAPP", 
        ATIVO: "SIM", 
        ORIGEM 
    });

    if(newCustomer) {
        const UNIDADE = await whatsappParametros.findOneBy({
            NOME: "UNIDADE_NOVO_CLIENTE"
        });

        const CAMPANHA = UNIDADE && await campanhasRepository.findOneBy({
            UNIDADE: Number(UNIDADE.VALOR),
            TIPO: "PROSPE"
        });
    
        await CCRepository.save({
            CAMPANHA: CAMPANHA?.CODIGO || 4,
            CLIENTE: newCustomer.CODIGO,
            CONCLUIDO: "NAO",
            DT_AGENDAMENTO: new Date().setDate(new Date().getDate() + 3),
            OPERADOR: 0,
            FONE1: NUMERO_WITHOUT_MINUS
        });
    };

    return newCustomer;
};