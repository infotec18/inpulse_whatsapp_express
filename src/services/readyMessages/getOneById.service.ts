import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessage } from "../../entities/readyMessage.entity";
import { AppError } from "../../errors";

export async function getOneReadyMessageService(id: number): Promise<ReadyMessage> {
    const messagesRepository: Repository<ReadyMessage> = AppDataSource.getRepository(ReadyMessage);

    const findMessage: ReadyMessage | null = await messagesRepository.findOneBy({
        CODIGO: id
    });

    if(!findMessage) throw new AppError("Customer provided on token is not found.", 404);

    return findMessage;
}
