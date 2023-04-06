import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";

export async function getAllReadyMessagesService(limite: number, pagina: number, search: string | undefined) {
    const messagesRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    const messagesQuery = await messagesRepository
        .createQueryBuilder('mensagens_prontas')
        .leftJoinAndSelect('mensagens_prontas.ARQUIVO', 'file')
        .orderBy('mensagens_prontas.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)
        
    if(search){
        messagesQuery.where('mensagens_prontas.TITULO LIKE :search', {search: `%${search}%`})
    }

    const [dados, total] = await messagesQuery.getManyAndCount();

    return { dados, total };
}