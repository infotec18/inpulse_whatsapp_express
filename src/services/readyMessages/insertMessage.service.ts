import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";

export async function insertReadyMessageService({APENAS_ADMIN, TEXTO_MENSAGEM, ARQUIVO}: ReadyMessage): Promise<ReadyMessage> {

    const messagesRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    const insertedMessage: ReadyMessage | null = await messagesRepository.save({
        APENAS_ADMIN,
        TEXTO_MENSAGEM,
        ARQUIVO
    });

    return insertedMessage;
};