import WebSocket from "./WebSocket";
import services from "../services";
import { Sessions } from "./Sessions";
import { Attendance } from "../entities/attendance.entity";
import { FinishAttendanceProps, RunningAttendance } from "../interfaces/attendances.interfaces";
import { OficialWhatsappMessage, OficialWhatsappMessageTemplate, SendMessageData, WhatsappMessage } from "../interfaces/messages.interfaces";
import { Socket } from "socket.io";
import path from "path";
import { surveyBot } from "../bots/surveyBot";
import { getSpecificAttendance } from "../services/attendances/getSpecificAttendance.service";
import FormData from "form-data"
import axios from "axios";
import { saveAndConvertAudioServiceOficial } from "../services/files/saveAndConvertAudioOficial.service";
import { runningAttendances, runningSurveys } from "./WhatsappClient";
import { saveAndReadFile } from "../services/files/saveAndReadFile.service";

export async function getRunningAttendances () {
    const attendances = await services.attendances.getAllRunning();
    for (const a of attendances) {
        const findMessages = await services.messages.getAllByAttendance(a.CODIGO);
        const WPP = await services.wnumbers.getById(a.CODIGO_NUMERO);
        const client = await services.customers.getOneById(a.CODIGO_CLIENTE);

        if(WPP && client) {
            let newRA: RunningAttendance = {
                CODIGO_ATENDIMENTO: a.CODIGO,
                CODIGO_CLIENTE: a.CODIGO_CLIENTE,
                CODIGO_NUMERO: a.CODIGO_NUMERO,
                CODIGO_OPERADOR: a.CODIGO_OPERADOR,
                MENSAGENS: findMessages ,
                WPP_NUMERO: WPP.NUMERO,
                AVATAR: "",
                DATA_INICIO: a.DATA_INICIO,
                URGENCIA: a.URGENCIA,
                CPF_CNPJ: client.CPF_CNPJ,
                NOME: WPP.NOME,
                RAZAO: client.RAZAO
            };
            runningAttendances.create(newRA);
        };
    };
};

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
                            newMessage && WebSocket.to(socket.id).emit("new-message", newMessage); 
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
                .catch((error) => {
                    console.error(error.response.data)
                });
    
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
                                newMessage && WebSocket.to(socket.id).emit("new-message", newMessage); 
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
                            newMessage && WebSocket.to(socket.id).emit("new-message", newMessage); 
                        }
                    })
                    .catch(err => {
                        console.error(err.response)
                    });
            };
        }); 
        
        socket.on("send-mass-template", async (data: any) => {

            const template = data.template as OficialWhatsappMessageTemplate;

            data.listaDeNumeros.forEach( async (number: string) => {
                const numero = number.replace(/\+/g, ''); 

                const body = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": numero,
                    "type": "template",
                    "template": {
                      "name": template.name,
                      "language": {
                        "code": template.language
                      }
                    }
                };
            
                axios.post(
                    `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                        }
                    }
                )
                .catch(err => console.log(new Date().toLocaleString(), ": Erro ao enviar template para: ", numero))

            });   
        });
    
        socket.on("finish-attendance", async(data: FinishAttendanceProps) => {
            const survey = await services.attendances.finish(data.CODIGO_ATENDIMENTO, data.CODIGO_RESULTADO, 0);
            if(survey) {
                //const { registration, reply } = await surveyBot(survey, "");
                try {
                    const attendance = await getSpecificAttendance(data.CODIGO_ATENDIMENTO);
                    const number = attendance && await services.wnumbers.getById(attendance.CODIGO_NUMERO);
                    //number && reply && WhatsappWeb.sendMessage(`${number.NUMERO}@c.us`, reply);
                    //runningSurveys.update(survey.WPP_NUMERO, registration);
                } catch (err) {
                    console.log(new Date().toLocaleString(), ": error on survey: ", err);
                };
            }
        });
    
        socket.on("start-attendance", async(data: { cliente: number, numero: number, wpp: string, pfp: string, template: OficialWhatsappMessageTemplate }) => {
            const operator = Sessions.value.find(s => s.sessions.includes(socket.id));
    
            const client = await services.customers.getOneById(data.cliente);
            const number = await services.wnumbers.getById(data.numero);
    
            if(operator && client && number){
                const newAttendance: Attendance = await services.attendances.create({
                    CODIGO_OPERADOR: operator.userId,
                    CODIGO_CLIENTE: data.cliente,
                    CODIGO_NUMERO: data.numero,
                    CONCUIDO: 0,
                    DATA_INICIO: new Date(),
                    DATA_FIM: null
                }); 

                await axios.post(
                    `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
                    {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": data.wpp,
                        "type": "template",
                        "template": {
                          "name": data.template.name,
                          "language": {
                            "code": data.template.language
                          }
                        }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                        }
                    }
                ).
                then(async(res) => {
                    const message: OficialWhatsappMessage = {
                        from: "me",
                        id: "",
                        timestamp: `${Date.now()}`,
                        type: "text",
                        text: {
                            body: `Template enviado: ${data.template.name}`
                        }
                    };

                    const createdMessage = await services.messages.createOficial(message, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, "", true, false);
                    
                    createdMessage && runningAttendances.create({
                        CODIGO_ATENDIMENTO: newAttendance.CODIGO,
                        CODIGO_CLIENTE: newAttendance.CODIGO_CLIENTE,
                        CODIGO_OPERADOR: newAttendance.CODIGO_OPERADOR,
                        CODIGO_NUMERO: newAttendance.CODIGO_NUMERO,
                        WPP_NUMERO: data.wpp,
                        MENSAGENS: [createdMessage],
                        AVATAR: data.pfp,
                        DATA_INICIO: newAttendance.DATA_INICIO,
                        URGENCIA: newAttendance.URGENCIA,
                        NOME: number.NOME,
                        RAZAO: client.RAZAO,
                        CPF_CNPJ: client.CPF_CNPJ
                    });
        
                    runningAttendances.returnOperatorAttendances(operator.userId);
        
                    const session = await Sessions.getOperatorSession(operator.userId);
                    if(session) {
                        Sessions.updateOperatorRunningAttendances(session.userId, session.attendances + 1)
                    };
                })
                .catch(err =>  console.error(err));


            };
        });
    
        socket.on("schedule-attendance", async(data: { CODIGO_ATENDIMENTO: number, DATA_AGENDAMENTO: Date }) => {
            await services.attendances.updateSchedulesDate(data.CODIGO_ATENDIMENTO, data.DATA_AGENDAMENTO);
        });
    
        socket.on("update-operator", async(data: { CODIGO_ATENDIMENTO: number, CODIGO_OPERADOR: number }) => {
            services.attendances.updateOp(data.CODIGO_ATENDIMENTO, data.CODIGO_OPERADOR);
        });
    
        socket.on("update-urgencia", (data: { CODIGO_ATENDIMENTO: number, URGENCIA: "URGENTE" | "ALTA" | "NORMAL" }) => {
            services.attendances.updateUrgencia(data.CODIGO_ATENDIMENTO, data.URGENCIA);
        });
    };
});