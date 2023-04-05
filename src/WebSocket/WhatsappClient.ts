import {  Client, LocalAuth } from "whatsapp-web.js";
import WebSocket from "./WebSocket";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import { Sessions } from "./Sessions";
import { Attendance } from "../entities/attendance.entity";
import { RetrieveMessage, RunningAttendance, RunningRegistration, Session } from "../interfaces/attendances.interfaces";
import { registrationBot } from "../bots/registration.bot";
import { SendMessageData, WhatsappMessage } from "../interfaces/messages.interfaces";
import { Customer } from "../entities/customer";
import { Socket } from "socket.io";

const WhatsappWeb = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--disable-gpu",
        ]
    }
});

export let RunningAttendances: Array<RunningAttendance> = [];
let RunningRegistrations: Array<RunningRegistration> = [];

export async function getRunningAttendances () {
    const attendances = await services.attendances.getAllRunning();
    
    attendances.forEach(async(a) => {
        const findMessages = await services.messages.getAllByAttendance(a.CODIGO);
        const WPP = await services.wnumbers.getOneById(a.CODIGO_NUMERO);


        if(WPP) {
            const PFP = await WhatsappWeb.getProfilePicUrl(WPP.NUMERO + "@c.us");
            
            let newRA: RunningAttendance = {
                CODIGO_ATENDIMENTO: a.CODIGO,
                CODIGO_CLIENTE: a.CODIGO_CLIENTE,
                CODIGO_NUMERO: a.CODIGO_NUMERO,
                CODIGO_OPERADOR: a.CODIGO_OPERADOR,
                MENSAGENS: findMessages ,
                WPP_NUMERO: WPP.NUMERO,
                AVATAR: PFP
            };

            RunningAttendances.push(newRA);
        };
    });
};

WhatsappWeb.on("qr", (qr: string) => { WebSocket.emit("qr", qr) });
WhatsappWeb.on("authenticated", (data) => { WebSocket.emit("authenticated", data) });

WhatsappWeb.on("message", async (message) => {

    if(message.type === "sticker") return;
    
    const str: string = message.from;
    const number: string = str.slice(0, str.length - 5);

    const registrating: RunningRegistration | undefined = RunningRegistrations.find(rr => rr.WPP_NUMERO === number && !rr.CONCLUIDO);
    const attending: number = RunningAttendances.findIndex(ra => ra.WPP_NUMERO === number);
    const PFP = await WhatsappWeb.getProfilePicUrl(message.from);
    
    if (attending >= 0) {
        console.log("Encontrou uma Running Attendance.");
        const newMessage: RetrieveMessage = await services.messages.create(message as unknown as WhatsappMessage, RunningAttendances[attending].CODIGO_ATENDIMENTO);
        RunningAttendances[attending].MENSAGENS = [...RunningAttendances[attending].MENSAGENS, newMessage];
        
        const findSession: Session | undefined = Sessions.find(s => s.userId === RunningAttendances[attending].CODIGO_OPERADOR);

        if(!!findSession) {
            findSession && WebSocket.to(findSession.socketId).emit("new-message", newMessage);
            findSession && console.log("Encontrou uma sessão e emitiu a mensagem.", findSession);
            console.log("nova mensagem: ", newMessage);
        } else {
            console.log("Não encontrou uma sessào para emitir a mensagem.")
        }
    } else if(registrating) {

        const { registration, reply } = await registrationBot(registrating, message.body);
        reply && message.reply(reply);

        let index = RunningRegistrations.findIndex(r => r.WPP_NUMERO === number);
        RunningRegistrations[index] = registration;

        if(registration.CONCLUIDO) {
            RunningRegistrations = RunningRegistrations.filter(r => !r.CONCLUIDO);
        };

    } else {
        const findNumber: Wnumber | null = await services.wnumbers.find(number);

        if(findNumber) {
            console.log("Encontrou o número.");
            const findCustomer: Customer | null = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance: Attendance | null = await services.attendances.find(findNumber.CODIGO_CLIENTE);

           if(findAttendance) {
            console.log("Encontrou um atendimento.");

            const newMessage: RetrieveMessage = await services.messages.create(message as unknown as WhatsappMessage, findAttendance.CODIGO);
            const newRA: RunningAttendance = {
                CODIGO_ATENDIMENTO: findAttendance.CODIGO,
                CODIGO_CLIENTE: findAttendance.CODIGO_CLIENTE,
                CODIGO_OPERADOR: findAttendance.CODIGO_OPERADOR,
                CODIGO_NUMERO: findNumber.CODIGO,
                WPP_NUMERO: number,
                MENSAGENS: [newMessage],
                AVATAR: PFP
            };

            RunningAttendances.push(newRA);
            const findSession: Session | undefined = Sessions.find(s => s.userId === findAttendance.CODIGO_OPERADOR);
            const op_attendances = findSession && RunningAttendances.filter(ra => ra.CODIGO_OPERADOR === findSession.userId);
            findSession && WebSocket.to(findSession.socketId).emit("load-attendances", op_attendances);
            findSession && console.log("Encontrou uma sessão e emitiu a mensagem.", findSession);

            } else {
                console.log("Não encontrou um atendimento.");
                // Caso não encontre um atendimento para este número...
                    // Procura um operador logado:
                    const s: Session | undefined = await services.attendances.getOperator(findCustomer.OPERADOR | 0);

                    // Cria um novo atendimento:
                    if(s) {
                        console.log("Encontrou um operador logado: ", s);
                        const newAttendance: Attendance = await services.attendances.create({
                            CODIGO_OPERADOR: s.userId,
                            CODIGO_CLIENTE: findNumber.CODIGO_CLIENTE,
                            CODIGO_NUMERO: findNumber.CODIGO,
                            CONCUIDO: 0,
                            DATA_INICIO: new Date(),
                            DATA_FIM: null
                        }); 
    
                        const newMessage: RetrieveMessage = await services.messages.create(message as unknown as WhatsappMessage, newAttendance.CODIGO);
    
                        const newRA: RunningAttendance = {
                            CODIGO_ATENDIMENTO: newAttendance.CODIGO,
                            CODIGO_CLIENTE: newAttendance.CODIGO_CLIENTE,
                            CODIGO_OPERADOR: findCustomer.OPERADOR || 0,
                            CODIGO_NUMERO: findNumber.CODIGO,
                            WPP_NUMERO: number,
                            MENSAGENS: [newMessage],
                            AVATAR: PFP
                        };
    
                        RunningAttendances.push(newRA);

                        const op_attendances = RunningAttendances.filter(ra => ra.CODIGO_OPERADOR === s.userId);
                        WebSocket.to(s.socketId).emit("load-attendances", op_attendances);
                        console.log("Encontrou uma sessão e emitiu a mensagem.", op_attendances);
                    
                    } else {
                        console.log("Nenhum operador logado.")
                        message.reply("Desculpe, não estamos atendendo neste momento.")
                        // Fazer um bot
                    };
            };  
            
        } else {
            // Caso não encontre o número na base de dados...
            const newRegistration = { WPP_NUMERO: number, ETAPA: 1, DADOS: {}, CONCLUIDO: false};
            RunningRegistrations.push(newRegistration);
            const { registration, reply } = await registrationBot(newRegistration, message.body);
            reply && message.reply(reply);
            let index = RunningRegistrations.findIndex(r => r.WPP_NUMERO === number);
            RunningRegistrations[index] = registration;
        };
    }
});

WebSocket.on('connection', (socket: Socket) => {
    socket.on("send-message", async(data: SendMessageData) => {

        const message = data.referenceId ?
        await WhatsappWeb.sendMessage(data.chatId, data.content, { quotedMessageId: data.referenceId })
        :
        await WhatsappWeb.sendMessage(data.chatId, data.content);
        
        const number = message.to;

        const index = RunningAttendances.findIndex(r => number.includes(r.WPP_NUMERO));
        const newMessage = await services.messages.create(message as unknown as WhatsappMessage, RunningAttendances[index].CODIGO_ATENDIMENTO);

        RunningAttendances[index].MENSAGENS = [...RunningAttendances[index].MENSAGENS, newMessage];
        WebSocket.to(socket.id).emit("new-message", newMessage);
    }); 
});

export default WhatsappWeb;