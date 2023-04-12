import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { ReadyMessages } from "../../entities/readyMessages.entity";
import { AppError } from "../../errors";

export async function getOneReadyMessageService(id: number) {
    const messagesRepository: Repository<ReadyMessages> = AppDataSource.getRepository(ReadyMessages);

    // const findMessage: ReadyMessages | null = await messagesRepository.findOneBy({
    //     CODIGO: id
    // });

    const findMessage = await messagesRepository
        .createQueryBuilder('mensagens_prontas')
        .leftJoinAndSelect('mensagens_prontas.ARQUIVO', 'file')
        .where({CODIGO: id})
        .getOne()

    if(!findMessage) throw new AppError("Customer provided on token is not found.", 404);

    return findMessage;
}
