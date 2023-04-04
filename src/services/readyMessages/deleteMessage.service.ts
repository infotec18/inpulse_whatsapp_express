import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";

export async function deleteReadyMessageService(number: number): Promise<void> {

    const messageRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    await messageRepository.createQueryBuilder('mensagens_prontas')
        .delete()
        .from(ReadyMessages)
        .where("CODIGO = :id", {id: number})
        .execute();
};