import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";

export async function getAllReadyMessagesService(limite: number, pagina: number, search: string | undefined) {
    const messagesRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    const messagesQuery = await messagesRepository
        .createQueryBuilder('mensagens_prontas')
        .orderBy('mensagens_prontas.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)
        
    if(search){
        messagesQuery.where('mensagens_prontas.TEXTO_MENSAGEM LIKE :search', {search: `%${search}%`})
    }

    const [dados, total] = await messagesQuery.getManyAndCount();

    return { dados, total };
}