import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { Wnumber } from "../../entities/wnumber.entity";
import { Attendance } from "../../entities/attendance.entity";

export async function findByOperatorIdService(CODIGO_OPERADOR: number) {
    const customersRepository: Repository<Customer> = AppDataSource.getRepository(Customer);
    const clientsCampaignRepository: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const clientsNumbersRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    const findInClientsCampaign = await clientsCampaignRepository.find({
        where: { CONCLUIDO: "NAO", OPERADOR: CODIGO_OPERADOR }
    });

    const clientIds = findInClientsCampaign.map(cc => cc.CLIENTE);
    if (!clientIds.length) return

    const findNumbers = await clientsNumbersRepository.createQueryBuilder("clientes_numeros")
        .where("CODIGO_CLIENTE in (:...ids)", { ids: clientIds })
        .getMany();




    return clientIds;
};