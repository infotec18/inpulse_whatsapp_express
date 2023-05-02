import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { WhatsappChatMessage, WhatsappFileMessage, WhatsappMessage } from "../../interfaces/messages.interfaces";
import { MessageFile } from "../../entities/messageFile.entity";
import { RetrieveMessage } from "../../interfaces/attendances.interfaces";
import { writeFile } from "fs";
import WAWebJS from "whatsapp-web.js";
import { emojify, unemojify } from "node-emoji";
import { User } from "../../entities/user.entity";

export async function createMessageService(message: WhatsappMessage, cod_a: number, cod_o: number): Promise<RetrieveMessage | null> {
    try {
        const operatorsRepository: Repository<User> = AppDataSource.getRepository(User);
        const messagesRepository: Repository<Message> = AppDataSource.getRepository(Message);
        const messagesFilesRepository: Repository<MessageFile> = AppDataSource.getRepository(MessageFile);

        const operator = await operatorsRepository.findOneBy({ CODIGO: cod_o });
        const operatorName = operator ? operator.NOME : "DESCONHECIDO";

        const regexEmoji = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}]/gu;
        const regexEmoji2 = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gu;

        let messageText: string = "";

        if(message._data.type === "chat") {
            let msg = message as WhatsappChatMessage;
            messageText = unemojify(msg.body).replace(regexEmoji, "").replace(regexEmoji2, "");
        } else {
            let msg = message as WhatsappFileMessage;
            messageText = unemojify(msg._data.caption).replace(regexEmoji, "").replace(regexEmoji2, "");
        };

        if(messageText.length > 5000) messageText = messageText.slice(0, 5000);

        let newMessageB: Message = messagesRepository.create({
            CODIGO_ATENDIMENTO: cod_a,
            CODIGO_OPERADOR: cod_o,
            TIPO: message._data.type,
            MENSAGEM: message._data.id.fromMe ? `[${operatorName}]: ${messageText}` : messageText,
            DATA_HORA: new Date(Number(`${message._data.t}000`)),
            TIMESTAMP: Date.now(),
            FROM_ME: message._data.id.fromMe,
            ID: message._data.id._serialized
        }); 

        if(message._data.quotedStanzaID) {
            newMessageB.ID_REFERENCIA = message._data.quotedStanzaID
        };

        let newMessage = await messagesRepository.save(newMessageB);
        newMessage.MENSAGEM = emojify(newMessage.MENSAGEM);

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
                ARQUIVO: newMessageFile,

            };
        };

        return {
            ...newMessage,
        };
    } catch (err) {
        console.log(`Saving message error: `, new Date());
        console.log(err);
        return null
    };
};