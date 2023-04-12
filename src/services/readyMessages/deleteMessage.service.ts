import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";

export async function deleteReadyMessageService(number: number): Promise<void> {

    const messageRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    await messageRepository.createQueryBuilder('mensagens_prontas')
        .delete()
        .from(ReadyMessage)
        .where("CODIGO = :messageId", {messageId: number})
        .execute();
};