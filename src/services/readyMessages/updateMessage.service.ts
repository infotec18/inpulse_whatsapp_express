import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";

export async function updateReadyMessagesService(number: ReadyMessages, newData: Partial<ReadyMessages>): Promise<ReadyMessages> {

    const messagesRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    const updatedMessages = await messagesRepository.save({ ...number, ...newData });

    return updatedMessages;
};