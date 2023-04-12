import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";

export async function insertReadyMessageService({APENAS_ADMIN, TEXTO_MENSAGEM, TITULO}: ReadyMessage): Promise<ReadyMessages> {

    const messagesRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    const insertedMessage: ReadyMessage | null = await messagesRepository.save({
        APENAS_ADMIN,
        TEXTO_MENSAGEM,
        TITULO
    });

    return insertedMessage;
};