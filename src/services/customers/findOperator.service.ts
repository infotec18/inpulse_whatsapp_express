import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ClientCampaign } from "../../entities/clientCampaign.entity";

export async function findOperatorService(CODIGO_CLIENTE: number) {
    const clientsCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);

    const findInClientsCampaign = await clientsCampaignRepository.findOneBy({
        CONCLUIDO: "NAO", CLIENTE: CODIGO_CLIENTE 
    });

    const result = findInClientsCampaign ? findInClientsCampaign.OPERADOR : 0;

    return result;
};