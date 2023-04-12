import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { emojify } from "node-emoji";

export async function getAllMessagesByAttendanceService(cod_a: number): Promise<Array<Message>> {
    const messageRepository: Repository<Message> = AppDataSource.getRepository(Message);

    const messages = await messageRepository
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.ARQUIVO", "ARQUIVO")
        .where("message.CODIGO_ATENDIMENTO = :cod_a", { cod_a })
        .getMany();

    const returnMessagesWithEmoji = messages.map(m => {
        let msg = m;
        msg.MENSAGEM = emojify(msg.MENSAGEM);

        return msg;
    });

    return returnMessagesWithEmoji;
};