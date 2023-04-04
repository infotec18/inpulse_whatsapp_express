import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";

export async function insertReadyMessageService({APENAS_ADMIN, TEXTO_MENSAGEM, ARQUIVO}: ReadyMessages): Promise<ReadyMessages> {

    const messagesRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    const insertedMessage: ReadyMessages | null = await messagesRepository.save({
        APENAS_ADMIN,
        TEXTO_MENSAGEM,
        ARQUIVO
    });

    return insertedMessage;
};