import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";

export async function updateReadyMessagesService(number: ReadyMessage, newData: Partial<ReadyMessage>): Promise<ReadyMessage> {

    const messagesRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    const updatedMessages = await messagesRepository.save({ ...number, ...newData });

    return updatedMessages;
};