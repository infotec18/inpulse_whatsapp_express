import { Message } from "../../entities/message.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { FileResponse, OficialWhatsappMessage } from "../../interfaces/messages.interfaces";
import { MessageFile } from "../../entities/messageFile.entity";
import { RetrieveMessage } from "../../interfaces/attendances.interfaces";
import { writeFileSync } from "fs";
import { emojify, unemojify } from "node-emoji";
import { User } from "../../entities/user.entity";
import axios from "axios";
import path from "path";


export async function createOficialMessageService(message: OficialWhatsappMessage, cod_a: number, cod_o: number, fromMe?: boolean): Promise<RetrieveMessage | null> {
    try {
        const allowedTypes = ["text", "image", "audio", "video", "document"];
        const isVideo = message.type === "video";
        const isImage = message.type === "image";
        const isAudio = message.type === "audio";
        const isDocument = message.type === "document";

        if(!allowedTypes.includes(message.type)) return null;

        const operatorsRepository: Repository<User> = AppDataSource.getRepository(User);
        const messagesRepository: Repository<Message> = AppDataSource.getRepository(Message);
        const messagesFilesRepository: Repository<MessageFile> = AppDataSource.getRepository(MessageFile);

        const operator = await operatorsRepository.findOneBy({ CODIGO: cod_o });
        const operatorName = operator ? operator.NOME : "DESCONHECIDO";

        const regexEmoji = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}]/gu;
        const regexEmoji2 = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gu;

        let messageText: string = "";

        if(message.type === "text") {
            messageText = unemojify(message.text!.body).replace(regexEmoji, "").replace(regexEmoji2, "");
        }  else if(message.type === "image" && message.image!.caption) {
            messageText = unemojify(message.image!.caption).replace(regexEmoji, "").replace(regexEmoji2, "");
        };

        if(messageText.length > 5000) messageText = messageText.slice(0, 5000);

        let newMessageB: Message = messagesRepository.create({
            CODIGO_ATENDIMENTO: cod_a,
            CODIGO_OPERADOR: cod_o,
            TIPO: message.type,
            MENSAGEM: fromMe ? `[${operatorName}]: ${messageText}` : messageText,
            DATA_HORA: new Date(),
            TIMESTAMP: Date.now(),
            FROM_ME: fromMe ? fromMe : false,
            ID: message.id
        }); 

        if(message.context) {
            newMessageB.ID_REFERENCIA = message.context.id
        };

        let newMessage = await messagesRepository.save(newMessageB);
        newMessage.MENSAGEM = emojify(newMessage.MENSAGEM);

        if(message.type !== "text" && allowedTypes.includes(message.type)) {
            const fileId = isImage ? message.image!.id : isVideo ? message.video!.id : isAudio ? message.audio!.id : isDocument && message.document!.id;
            const mimeType = isImage ? message.image!.mime_type : isVideo ? message.video!.mime_type : isAudio ? message.audio!.mime_type : isDocument && message.document!.mime_type;

            const fileURL = await axios.get<FileResponse>(`https://graph.facebook.com/v16.0/${fileId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                }
            })
            .then(res => res.data.url);

            const ext = mimeType ? mimeType.split("/")[1].split(";")[0] : "unknown";
            const fileName = `file_${fileId}.${ext}`;

            await axios({
                method: 'get',
                url: fileURL,
                headers: {
                    'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
                },
                responseType: 'arraybuffer'
            })
            .then(function (response) {
                const filePath = path.join(__dirname, `../../../localFiles/messages`, fileName);
                writeFileSync(filePath, response.data);
            });

            const newMessageFile: MessageFile = await messagesFilesRepository.save({
                CODIGO_MENSAGEM: newMessage.CODIGO,
                TIPO: mimeType || "unknown",
                ARQUIVO: fileName
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
        console.log(new Date().toLocaleString(), `: Saving message error: `, err);
        return null
    };
};