import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { WhatsappChatMessage, WhatsappFileMessage, WhatsappMessage } from "../../interfaces/messages.interfaces";
import { MessageFile } from "../../entities/messageFile.entity";
import { RetrieveMessage } from "../../interfaces/attendances.interfaces";
import { writeFile } from "fs";
import WAWebJS from "whatsapp-web.js";

export async function createMessageService(message: WhatsappMessage, cod_a: number): Promise<RetrieveMessage> {

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

    let newMessageB: Message = messagesRepository.create({
        CODIGO_ATENDIMENTO: cod_a,
        TIPO: message._data.type,
        MENSAGEM: messageText,
        DATA_HORA: new Date(Number(`${message._data.t}000`)),
        TIMESTAMP: Date.now(),
        FROM_ME: message._data.id.fromMe,
        ID: message._data.id._serialized
    }); 

    if(message._data.quotedStanzaID) {
        newMessageB.ID_REFERENCIA = message._data.quotedStanzaID
    };

    const newMessage = await messagesRepository.save(newMessageB);

    if(message._data.type !== "chat" && message._data.mimetype) {
        const msg = message as unknown as WAWebJS.Message;

        const file = await msg.downloadMedia();
        const fileContent = Buffer.from(file.data, 'base64');
        
        const i = message._data.mimetype.split("").findIndex(i => i === "/");
        const isAudio: boolean = message._data.mimetype.includes("audio");

        const ext = isAudio ? "ogg" : message._data.mimetype.slice(i+1);

        const path = "./localFiles/messages";
        const filename = file.filename ? `${msg.id.id}_${Date.now()}_${file.filename}` : `${msg.id.id}_${Date.now()}.${ext}`;
        
        writeFile(`${path}/${filename}`, fileContent, (err) => {
            if (err) throw err;
        });

        const newMessageFile: MessageFile = await messagesFilesRepository.save({
            CODIGO_MENSAGEM: newMessage.CODIGO,
            TIPO: message._data.mimetype,
            ARQUIVO: filename    
        });

        return {
            ...newMessage,
            ARQUIVO: newMessageFile
        };
    };

    return newMessage;
};