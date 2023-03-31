import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { WhatsappChatMessage, WhatsappFileMessage, WhatsappMessage } from "../../interfaces/messages.interfaces";
import { MessageFile } from "../../entities/messageFile,entity";

export async function createMessageService(message: WhatsappMessage, cod_a: number): Promise<Message> {

    const messagesRepository: Repository<Message> = AppDataSource.getRepository(Message);
    const messagesFilesRepository: Repository<MessageFile> = AppDataSource.getRepository(MessageFile);

    let messageText: string = "";

    if(message._data.type === "chat") {
        let msg = message as WhatsappChatMessage;
        messageText = msg.body;
    } else {
        let msg = message as WhatsappFileMessage;
        messageText = msg._data.caption;
    };

    const newMessage: Message = await messagesRepository.save({
        CODIGO_ATENDIMENTO: cod_a,
        TIPO: message._data.type,
        MENSAGEM: messageText,
        DATA_HORA: new Date(Number(`${message._data.t}000`)),
        TIMESTAMP: Date.now(),
        FROM_ME: message._data.id.fromMe
    }); 

    if(message._data.type === "image") {
        const newFile: MessageFile = await messagesFilesRepository.save({
            CODIGO_MENSAGEM: newMessage.CODIGO,
            TIPO: message._data.mimetype,
            ARQUIVO: message._data.body      
        });
    };

    return newMessage;
};