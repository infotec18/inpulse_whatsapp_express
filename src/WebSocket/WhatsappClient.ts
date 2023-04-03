import { Client, LocalAuth } from "whatsapp-web.js";
import WebSocket from "./WebSocket";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import { Sessions } from "./Sessions";
import { Attendance } from "../entities/attendance.entity";
import { RetrieveMessage, RunningAttendance, RunningRegistration, Session } from "../interfaces/attendances.interfaces";
import { registrationBot } from "../bots/registration.bot";
import { WhatsappMessage } from "../interfaces/messages.interfaces";
import { Customer } from "../entities/customer";

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

WhatsappWeb.on("qr", (qr: string) => {
    WebSocket.emit("qr", qr);
});

WhatsappWeb.on("authenticated", (data) => {
    WebSocket.emit("authenticated", data);
});

WhatsappWeb.on("message", async (message) => {
    // Remove caracteres extras do número
    const str: string = message.from;
    const number: string = str.slice(0, str.length - 5);

    const isMe: boolean = message.fromMe;
    const registrating: RunningRegistration | undefined = RunningRegistrations.find(rr => rr.WPP_NUMERO === number && !rr.CONCLUIDO);
    const attending: number = RunningAttendances.findIndex(ra => ra.WPP_NUMERO === number);

    console.log(Sessions)
    console.log(RunningAttendances)
    
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

    } else if(!isMe) {
        const findNumber: Wnumber | null = await services.wnumbers.find(number);

        if(findNumber) {
            console.log("Encontrou o número.");
            const findCustomer: Customer | null = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance: Attendance | null = await services.attendances.find(findNumber.CODIGO_CLIENTE);

           if(findAttendance) {
            console.log("Encontrou um atendimento.")
            const newMessage: RetrieveMessage = await services.messages.create(message as unknown as WhatsappMessage, findAttendance.CODIGO);
            const newRA: RunningAttendance = {
                CODIGO_ATENDIMENTO: findAttendance.CODIGO,
                CODIGO_CLIENTE: findAttendance.CODIGO_CLIENTE,
                CODIGO_OPERADOR: findAttendance.CODIGO_OPERADOR,
                CODIGO_NUMERO: findNumber.CODIGO,
                WPP_NUMERO: number,
                MENSAGENS: [newMessage]
            };

            RunningAttendances.push(newRA);
            const findSession: Session | undefined = Sessions.find(s => s.userId === findAttendance.CODIGO_OPERADOR);
            const op_attendances = findSession && RunningAttendances.filter(ra => ra.CODIGO_OPERADOR === findSession.userId);
            findSession && WebSocket.to(findSession.socketId).emit("load-attendances", op_attendances);
            findSession && console.log("Encontrou uma sessão e emitiu a mensagem.", findSession);
            console.log("nova mensagem: ", newMessage);

            } else {
                console.log("Não encontrou um atendimento.");
                // Caso não encontre um atendimento para este número...
                    // Procura um operador logado:
                    const s: Session | undefined = await services.attendances.getOperator(findCustomer.OPERADOR | 0);
                    console.log("")
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
                            MENSAGENS: [newMessage]
                        };
    
                        RunningAttendances.push(newRA);

                        const op_attendances = RunningAttendances.filter(ra => ra.CODIGO_OPERADOR === s.userId);
                        WebSocket.to(s.socketId).emit("load-attendances", op_attendances);
                        console.log("Encontrou uma sessão e emitiu a mensagem.", op_attendances);
                    
                    } else {
                        console.log("Nenhum operador logado.")
                        message.reply("Desculpe, não estamos atendendo neste momento.")
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
    } else {
        console.log(message);
    };
});

export default WhatsappWeb;