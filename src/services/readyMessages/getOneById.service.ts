import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";
import { AppError } from "../../errors";

export async function getOneReadyMessageService(id: number): Promise<ReadyMessages> {
    const messagesRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    const findMessage: ReadyMessages | null = await messagesRepository.findOneBy({
        CODIGO: id
    });

    if(!findMessage) throw new AppError("Customer provided on token is not found.", 404);

    return findMessage;
}
