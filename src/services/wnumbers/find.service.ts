import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";
import { ClientCampaign } from "../../entities/clientCampaign.entity";

export async function findNumberService(wpp: string): Promise<Wnumber | null> {

    const WnumberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);
    const ClientCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);

    const findNumber: Wnumber | null = await WnumberRepository.findOneBy({
        NUMERO: wpp
    });

    if(findNumber) return findNumber;

    const ddd = wpp.slice(2,4);
    const body = wpp.slice(4);
    const search = `${ddd}9${body}`;
    
    const findInCampaigns: ClientCampaign | null = await ClientCampaignRepository
    .createQueryBuilder("clientCampaign")
    .where(
      `clientCampaign.FONE1 LIKE :wpp OR 
       clientCampaign.FONE2 LIKE :wpp OR 
       clientCampaign.FONE3 LIKE :wpp`,
      { wpp: `%${search}%` }
    ).getOne();

    console.log(findInCampaigns);
    
    if(findInCampaigns) {
        const newNumber: Wnumber = await WnumberRepository.save({
            CODIGO_CLIENTE: findInCampaigns.CLIENTE,
            NOME: "Nome Indefinido",
            NUMERO: wpp
        });

        return newNumber;

    } else {
        return null
    };

};