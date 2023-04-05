import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { MessageFile } from "../../entities/messageFile.entity";

export async function getAllMessagesByAttendanceService(cod_a: number): Promise<Array<Message>> {
    const messageRepository: Repository<Message> = AppDataSource.getRepository(Message);
    const messageFileRepository: Repository<MessageFile> = AppDataSource.getRepository(MessageFile);

    const messages = await messageRepository
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.arquivo", "arquivo")
        .where("message.CODIGO_ATENDIMENTO = :cod_a", { cod_a })
        .getMany();

    return messages;
};