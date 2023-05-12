import WebSocket from "./WebSocket";
import services from "../services";
import { Sessions } from "./Sessions";
import { FinishAttendanceProps, RunningAttendance, Urgency } from "../interfaces/attendances.interfaces";
import { OficialWhatsappMessage, OficialWhatsappMessageTemplate, SendMessageData } from "../interfaces/messages.interfaces";
import { Socket } from "socket.io";
import path from "path";
import FormData from "form-data"
import axios from "axios";
import { saveAndConvertAudioServiceOficial } from "../services/files/saveAndConvertAudioOficial.service";
import { runningAttendances, runningSurveys } from "./WhatsappClient";
import { saveAndReadFile } from "../services/files/saveAndReadFile.service";
import { OficialMessageMedia } from "../classes/OficialMessageMedia.class";
import { createReadStream } from "fs";
import { sendWhatsappMessageService } from "../services/whatsapp/sendMessage.service";
import { sendWhatsappTemplateService } from "../services/whatsapp/sendTemplate.service";

export const oficialApiFlow = WebSocket.on('connection', (socket: Socket) => {
    if(process.env.OFICIAL_WHATSAPP === "true") {
        socket.on("send-message", async(data: SendMessageData) => {
            const options = data.referenceId ? { quotedMessageId: data.referenceId } : { };
    
            if(data.type === "audio" && !!data.file) {
                const file = await saveAndConvertAudioServiceOficial(data.file);
        
                const form = new FormData();
                form.append('file', file);
                form.append('type', 'audio/ogg; codecs=opus');
                form.append('messaging_product', "whatsapp");
    
                const headers = form.getHeaders();
    
                const fileId = await axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/media`, form, {
                    headers: {
                        'Content-Type': headers['content-type'],
                        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                    }
                })
                .then((response) => response.data.id)
                .catch((error) => {
                    console.error(error.response.data)
                });
    
                setTimeout(() => {
                    axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
                        recipient_type: "individual",
                        messaging_product: "whatsapp",
                        to: data.chatId.replace("@c.us", ""),
                        type: "audio",
                        audio: {
                            id: `${fileId}`
                        }
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(async(res) => {
                        const ra: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: data.chatId.replace("@c.us", "") });
                        if(ra) {
                            const newMessage = await services.messages.createOficial({
                                from: 'me',
                                type: "audio",
                                timestamp: `${Date.now()}`.slice(3),
                                id: res.data.messages[0].id,
                                audio: {
                                    id: fileId,
                                    mime_type: "audio/ogg"
                                }}, ra.CODIGO_ATENDIMENTO, ra.CODIGO_OPERADOR, null, true);
                                
                            newMessage && runningAttendances.update(ra.CODIGO_ATENDIMENTO, { MENSAGENS: [...ra.MENSAGENS, newMessage] }); 
                        }
                    })
                    .catch(err => {
                        console.error(err.response.data)
                    });
                }, 500);
    
            } else if(data.type === "media" && !!data.file){
                const file = await saveAndReadFile(data.file);
    
                const form = new FormData();
                form.append('file', file);
                form.append('type', data.file.type);
                form.append('messaging_product', "whatsapp");
    
                const headers = form.getHeaders();
    
                const fileId = await axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/media`, form, {
                    headers: {
                        'Content-Type': headers['content-type'],
                        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                    }
                })
                .then((response) => response.data.id)
                .catch((error) => console.error(error.response.data));
    
                const x = data.file.type.split("/")[0];
                const mediaType = x === "image" ? x : x === "video" ? x : x === "audio" ? x : "document";
                
                
                setTimeout(() => {
                    axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
                        recipient_type: "individual",
                        messaging_product: "whatsapp",
                        to: data.chatId.replace("@c.us", ""),
                        type: mediaType,
                        [mediaType]: {
                            id: fileId
                        }
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(async(res) => {
                        if(mediaType === "video" || mediaType === "audio" || mediaType === "image" || mediaType === "document"){
                            let mType = mediaType as unknown as "video";
                            const ra: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: data.chatId.replace("@c.us", "") });
                            if(ra) {
                                const newMessage = await services.messages.createOficial({
                                    from: 'me',
                                    type: mType,
                                    timestamp: `${Date.now()}`.slice(3),
                                    id: res.data.messages[0].id,
                                    [mType]: {
                                        id: fileId,
                                        mime_type: data.file!.type,
                                    }}, ra.CODIGO_ATENDIMENTO, ra.CODIGO_OPERADOR, null, true);
    
                                newMessage && runningAttendances.update(ra.CODIGO_ATENDIMENTO, { MENSAGENS: [...ra.MENSAGENS, newMessage] }); 

                            }
                        }
                    }).catch(err => {
                        console.error(err.response.data)
                    });
                }, 1000);
            
            } else {
                const reqBody: any = {
                    recipient_type: "individual",
                    messaging_product: "whatsapp",
                    to: data.chatId.replace("@c.us", ""),
                    type: "text",
                    text: {
                        body: data.text
                    }
                };
    
                if(data.referenceId) reqBody["context"] = { message_id: data.referenceId };
    
                axios.post(
                    `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, 
                    reqBody, 
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(async(res) => {
                        const ra: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: data.chatId.replace("@c.us", "") });
                        if(ra) {
                            const newMessage = await services.messages.createOficial({
                                from: 'me',
                                type: "text",
                                timestamp: `${Date.now()}`.slice(3),
                                id: res.data.messages[0].id,
                                text: {
                                    body: data.text
                                }}, ra.CODIGO_ATENDIMENTO, ra.CODIGO_OPERADOR, reqBody.context?.message_id, true);
                                
                            newMessage && runningAttendances.update(ra.CODIGO_ATENDIMENTO, { MENSAGENS: [...ra.MENSAGENS, newMessage] }); 
                        }
                    })
                    .catch(err => {
                        console.error(err.response)
                    });
            };
        }); 
        
        socket.on("send-mass-template", async (data: any) => {

            const session = Sessions.value.find(s => s.sessions.includes(socket.id))

            const template = data.template as OficialWhatsappMessageTemplate;
            const user = session && await services.users.getOneById(session.userId);

            data.listaDeNumeros.forEach( async (number: string) => {
                const numero = number.replace(/\+/g, '');
                const Wnumber = await services.wnumbers.find(numero);
                
                if(user && Wnumber) {
                    await sendWhatsappTemplateService({
                        template: template,
                        operator: user,
                        whatsappNumber: Wnumber,
                    });
                } else {
                    socket.emit("toast-error", `Falha ao enviar template para ${number}`);
                };
            });   
        });

        socket.on("send-template", async (data: any) => {
            const session = Sessions.value.find(s => s.sessions.includes(socket.id))
            const template = data.template as OficialWhatsappMessageTemplate;
            const user = session && await services.users.getOneById(session.userId);
            const attendance = data.attendance as RunningAttendance;
            const Wnumber = await services.wnumbers.getById(attendance.CODIGO_NUMERO);
                
            if(user && Wnumber) {
                const messageId = await sendWhatsappTemplateService({
                    template: template,
                    operator: user,
                    whatsappNumber: Wnumber,
                });

                if(messageId) {
                    const message: OficialWhatsappMessage = {
                        from: "me",
                        id: messageId,
                        timestamp: `${Date.now()}`,
                        type: "text",
                        text: {
                            body: `Template "${data.template.name}" enviado com sucesso!`
                        }
                    };

                    const msg = await services.messages.createOficial(message, attendance.CODIGO_ATENDIMENTO, user.CODIGO, null, true, false);
                    msg && runningAttendances.insertNewMessage(attendance.CODIGO_ATENDIMENTO, msg)
                };

            } else {
                socket.emit("toast-error", "falha ao enviar template...");
            };
        });   
        
        socket.on("send-ready-message", async (data: any) => {
            const getMessage = await services.readyMessages.getOneById(data.messageId);
            const whatsappNumber = data.listaDeNumeros[0].replace(/\+/g, '');
                
            if(getMessage.ARQUIVO) {
                const filePath = path.join(__dirname, '../../localFiles/readyMessages/', getMessage.ARQUIVO.ARQUIVO); 
                const media = new OficialMessageMedia(createReadStream(filePath), getMessage.ARQUIVO.TIPO);
                const x = getMessage.ARQUIVO.TIPO.split("/")[0];
                const mediaType = x === "image" ? x : x === "video" ? x : x === "audio" ? x : "document"; 
                const mediaId = await media.getMediaId()
                mediaId && sendWhatsappMessageService({
                    to: whatsappNumber,
                    type: mediaType,
                    text: "",
                    fileId: mediaId,
                    caption: getMessage.TEXTO_MENSAGEM
                });
            } else {
                sendWhatsappMessageService({
                    to: whatsappNumber,
                    type: "text",
                    text: getMessage.TEXTO_MENSAGEM
                });
            };
        });
    
        socket.on("finish-attendance", async(data: FinishAttendanceProps) => {
            const survey = await services.attendances.finish(data.CODIGO_ATENDIMENTO, data.CODIGO_RESULTADO, data.DATA_AGENDAMENTO);
            /* if(survey) {
                //const { registration, reply } = await surveyBot(survey, "");
                try {
                    const attendance = await getSpecificAttendance(data.CODIGO_ATENDIMENTO);
                    const number = attendance && await services.wnumbers.getById(attendance.CODIGO_NUMERO);
                    //number && reply && WhatsappWeb.sendMessage(`${number.NUMERO}@c.us`, reply);
                    //runningSurveys.update(survey.WPP_NUMERO, registration);
                } catch (err) {
                    console.log(new Date().toLocaleString(), ": error on survey: ", err);
                };
            } */
        });
    
        socket.on("start-attendance", async(data: { cliente: number, numero: number, wpp: string, pfp: string, template: OficialWhatsappMessageTemplate }) => {
            const session = Sessions.value.find(s => s.sessions.includes(socket.id));
            const operator = session && await services.users.getOneById(session.userId);
    
            const client = await services.customers.getOneById(data.cliente);
            const number = await services.wnumbers.getById(data.numero);

            const isClientBeingAttended = client && runningAttendances.find({ CODIGO_CLIENTE: client.CODIGO });
            
            if(isClientBeingAttended) {
                socket.emit("toast", "Este contato já está sendo atendido por outro operador...");
                return;
            };

            if(operator && client && number && !isClientBeingAttended){
                sendWhatsappTemplateService({ operator, whatsappNumber: number, template: data.template})
                .then(async(res) => {
                    if(res) {
                        const message: OficialWhatsappMessage = {
                            from: "me",
                            id: res,
                            timestamp: `${Date.now()}`,
                            type: "text",
                            text: {
                                body: `Template "${data.template.name}" enviado com sucesso!`
                            }
                        };
        
                        const newAttendance = await services.attendances.startNew({
                            client: client,
                            number: number,
                            operator: session,
                            messages: [],
                            ativoRecep: "ATIVO"
                        });
                        
                        if(newAttendance) {
                            const newMessage = await services.messages.createOficial(message, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, "", true, false);
                            newAttendance && newMessage && runningAttendances.insertNewMessage(newAttendance.CODIGO, newMessage);
                        };
                    }
                })
                .catch(err =>  console.error(err));
            };
        });
    
        socket.on("schedule-attendance", async(data: { CODIGO_ATENDIMENTO: number, DATA_AGENDAMENTO: Date }) => {
            await services.attendances.updateSchedulesDate(data.CODIGO_ATENDIMENTO, data.DATA_AGENDAMENTO, "ALTA");
        });
    
        socket.on("update-operator", async(data: { CODIGO_ATENDIMENTO: number, CODIGO_OPERADOR: number }) => {
            services.attendances.updateOp(data.CODIGO_ATENDIMENTO, data.CODIGO_OPERADOR);
        });
    
        socket.on("update-urgencia", (data: { 
            CODIGO_ATENDIMENTO: number, 
            URGENCIA: Urgency, 
            mode: "Supervisor" | "Operator"
        }) => {
            services.attendances.updateUrgencia(data.CODIGO_ATENDIMENTO, data.URGENCIA, data.mode);
        });
    };
});