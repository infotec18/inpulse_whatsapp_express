import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Wnumber } from "../../entities/wnumber.entity";
import WhatsappWeb from "../../WebSocket/WhatsappClient";

export async function findByOperatorIdService(CODIGO_OPERADOR: number) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const clientsCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const clientsNumbersRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findInClientsCampaign = await clientsCampaignRepository.find({
        where: { CONCLUIDO: "NAO", OPERADOR: CODIGO_OPERADOR }
    });

    console.log("findInClientsCampaign: ", findInClientsCampaign);
    const clientIds = findInClientsCampaign.map(cc => cc.CLIENTE);
    console.log("clientIds: ", clientIds);
    if(!clientIds.length) return

    const findNumbers = await clientsNumbersRepository.createQueryBuilder("clientes_numeros")
        .where("CODIGO_CLIENTE in (:...ids)", { ids: clientIds })
        .getMany(); 
    
    console.log(findNumbers);

    const returnArr = [];
    
    if(findNumbers.length) {
        for (const n of findNumbers) {
            const findCustomer = await customersRepository.findOne({ where: { CODIGO: n.CODIGO_CLIENTE } });
            if (findCustomer) {
                const PFP = await WhatsappWeb.getProfilePicUrl(`${n.NUMERO}@c.us`);
                returnArr.push({
                    CODIGO_CLIENTE: n.CODIGO_CLIENTE,
                    CODIGO_NUMERO: n.CODIGO,
                    NOME: n.NOME,
                    RAZAO: findCustomer.RAZAO,
                    PESSOA: findCustomer.PESSOA,
                    CPF_CNPJ: findCustomer.CPF_CNPJ,
                    AVATAR: PFP || null
                });
            };
        };
    };
    
    return returnArr;
};