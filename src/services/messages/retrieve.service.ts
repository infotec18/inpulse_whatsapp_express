import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { MessageFile } from "../../entities/messageFile.entity";
import WebSocket from "../../WebSocket/WebSocket";

export async function retrieveMessageService(message: Message, socketId: string) {
    const MessageFileRepository: Repository<MessageFile> = AppDataSource.getRepository(MessageFile);
    const file = await MessageFileRepository.findOneBy({
        CODIGO_MENSAGEM: message.CODIGO
    });

    if(file) {
         return {
            ...message,
            ARQUIVO: file.ARQUIVO,
            ARQUIVO_TIPO: file.TIPO
        }
    } else {
       return message;
    };
};