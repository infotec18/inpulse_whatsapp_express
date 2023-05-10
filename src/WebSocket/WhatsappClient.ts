import WAWebJS, {  Client, LocalAuth, MessageMedia } from "whatsapp-web.js";
import WebSocket from "./WebSocket";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import { Sessions } from "./Sessions";
import { Attendance } from "../entities/attendance.entity";
import { FinishAttendanceProps, OperatorUrgency, RunningAttendance, RunningRegistration, RunningSurvey, ScheduleUrgency, SupervisorUrgency } from "../interfaces/attendances.interfaces";
import { registrationBot } from "../bots/registration.bot";
import { SendMessageData, WhatsappMessage } from "../interfaces/messages.interfaces";
import { Customer } from "../entities/customer";
import { Socket } from "socket.io";
import { RunningAttendances } from "./RunningAttendances";
import path from "path";
import * as fs from 'fs';
import { RunningRegistrations } from "./RunningRegistrations";
import { RunningSurveys } from "./RunningSurveys";
import { surveyBot } from "../bots/surveyBot";
import { getSpecificAttendance } from "../services/attendances/getSpecificAttendance.service";

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

export const runningAttendances = new RunningAttendances([]);
export const runningRegistrations = new RunningRegistrations([]);
export const runningSurveys = new RunningSurveys([]);

export async function getRunningAttendances () {
    const attendances = await services.attendances.getAllRunning();

    for (const a of attendances) {
        
        const findMessages = await services.messages.getAllByAttendance(a.CODIGO);
        const WPP = await services.wnumbers.getById(a.CODIGO_NUMERO);
        const client = await services.customers.getOneById(a.CODIGO_CLIENTE);
        const operator = await Sessions.getOperatorSession(a.CODIGO_OPERADOR);

        if(WPP && client && operator) {
            async function PFP () {
                if(process.env.OFICIAL_WHATSAPP === "false" && WPP) {
                    return await WhatsappWeb.getProfilePicUrl(WPP.NUMERO + "@c.us");
                } else {
                    return "";
                };
            };

            runningAttendances.create({
                CODIGO_ATENDIMENTO: a.CODIGO,
                CODIGO_CLIENTE: client.CODIGO,
                CODIGO_NUMERO: WPP.CODIGO,
                CODIGO_OPERADOR: a.CODIGO_OPERADOR,
                CODIGO_OPERADOR_ANTERIOR: a.CODIGO_OPERADOR_ANTERIOR,
                CPF_CNPJ: client.CPF_CNPJ,
                DATA_INICIO: a.DATA_INICIO,
                MENSAGENS: findMessages,
                NOME: WPP.NOME,
                RAZAO: client.RAZAO,
                URGENCIA_AGENDAMENTO: a.URGENCIA_AGENDAMENTO,
                URGENCIA_OPERADOR: a.URGENCIA_OPERADOR,
                URGENCIA_SUPERVISOR: a.URGENCIA_SUPERVISOR,
                WPP_NUMERO: WPP.NUMERO,
                AVATAR: await PFP()
            });
        };
    };
};

WhatsappWeb.on("qr", (qr: string) => { WebSocket.emit("qr", qr) });
WhatsappWeb.on("authenticated", (data) => { WebSocket.emit("authenticated", data) });

WhatsappWeb.on("message", async (message) => {
    if((await message.getChat()).isGroup) return;

    const str: string = message.from;
    const number: string = str.slice(0, str.length - 5);

    const registrating: RunningRegistration | undefined = runningRegistrations.find({ WPP_NUMERO: number });
    const survey: RunningSurvey | undefined = runningSurveys.find(number);
    const attending: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: number });
    const PFP = await WhatsappWeb.getProfilePicUrl(message.from);

    if (attending) {
        const newMessage = await services.messages.create(message as unknown as WhatsappMessage, attending.CODIGO_ATENDIMENTO, attending.CODIGO_OPERADOR);
        newMessage && runningAttendances.insertNewMessage(attending.CODIGO_ATENDIMENTO, newMessage);
    } else if(registrating) {
        const { registration, reply } = await registrationBot(registrating, message.body);
        reply && message.reply(reply);
        runningRegistrations.update(number, registration);
    } else if(survey) {
        const { registration, reply } = await surveyBot(survey, message.body);
        reply && message.reply(reply);
        runningSurveys.update(number, registration);
    } else {
        const findNumber: Wnumber | null = await services.wnumbers.find(number);

        if(findNumber) {
            const findCustomer: Customer | null = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance: Attendance | null = await services.attendances.find(findNumber.CODIGO);

            if(findAttendance && findCustomer) {
                const operatorSession = await Sessions.getOperatorSession(findAttendance.CODIGO_OPERADOR) 
                const newMessage = await services.messages.create(message as unknown as WhatsappMessage, findAttendance.CODIGO, findAttendance.CODIGO_OPERADOR);

                if(newMessage && operatorSession) {
                    services.attendances.startNew({
                        client: findCustomer,
                        number: findNumber,
                        operator: operatorSession,
                        avatar: PFP,
                        messages: [newMessage]
                    });
                };
            } else if(findCustomer){
                const findOperator = await services.customers.findOperator(findCustomer.CODIGO);
                const avaliableOperator = await services.attendances.getOperator(findOperator);
                const operator = avaliableOperator && await Sessions.getOperatorSession(avaliableOperator)

                if(operator) {
                    const newAttendance = await services.attendances.startNew({
                        client: findCustomer,
                        number: findNumber,
                        operator: operator,
                        avatar: PFP
                    });

                    const newMessage = newAttendance && await services.messages.create(message as unknown as WhatsappMessage, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR);
                    newAttendance && newMessage && runningAttendances.insertNewMessage(newAttendance.CODIGO, newMessage);
                } else {
                    console.log(new Date().toLocaleString(), `: Sem operador online para atender: Cliente de ID ${findNumber.CODIGO_CLIENTE} | WPP: ${number}`);
                    console.log(new Date().toLocaleString(), ": Mensagem: ", message.body);
                };
            };  
            
        } else {
            const msgTimestamp = Number(`${message.timestamp}000`);
            const isMessageFromNow = (msgTimestamp + 60000) >= Date.now();

            if(isMessageFromNow) {
                const newRegistration = { WPP_NUMERO: number, ETAPA: 1, ETAPA_COUNT: 0, DADOS: {}, CONCLUIDO: false};
                runningRegistrations.create(newRegistration);
                const { registration, reply } = await registrationBot(newRegistration, message.body);
                reply && message.reply(reply);
                runningRegistrations.update(number, registration);
            };
        };
    };
});
if(process.env.OFICIAL_WHATSAPP === "false") {
    WebSocket.on('connection', (socket: Socket) => {
        socket.on("send-message", async(data: SendMessageData) => {
            const options = data.referenceId ? { quotedMessageId: data.referenceId } : { };
    
            if(data.type === "audio" && !!data.file) {
    
                const newData = await services.files.saveAndConvertAudio(data.file);
                const media = new MessageMedia("audio/ogg; codecs=opus", newData, data.file.name);
                
                const message = await WhatsappWeb.sendMessage(data.chatId, media, { ...options, sendAudioAsVoice: true });
                handleMessage(message);
    
            } else if(data.type === "media" && !!data.file){
                const { type, name, buffer} = data.file;
    
                const media = new MessageMedia(type, Buffer.from(buffer).toString('base64'), name);
                const message = await WhatsappWeb.sendMessage(data.chatId, data.text, { ...options, media: media });
    
                handleMessage(message);
    
            } else {
                const message = await WhatsappWeb.sendMessage(data.chatId, data.text, options);
                handleMessage(message);
            };
    
            async function handleMessage(message: WAWebJS.Message) {
                const str: string = message.to;
                const number: string = str.slice(0, str.length - 5);
    
                const ra: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: number });
    
                if(ra) {
                    const newMessage = await services.messages.create(message as unknown as WhatsappMessage, ra.CODIGO_ATENDIMENTO, ra.CODIGO_OPERADOR);
    
                    newMessage && runningAttendances.update(ra.CODIGO_ATENDIMENTO, { MENSAGENS: [...ra.MENSAGENS, newMessage] }); 
                    newMessage && WebSocket.to(socket.id).emit("new-message", newMessage); 
                };
    
            };
        }); 
    
        socket.on("send-ready-message", async (data: any) => {
            const getMessage = await services.readyMessages.getOneById(data.messageId);
    
            data.listaDeNumeros.forEach( async (number: string) => {
                const numero = number.replace(/\+/g, '');
                const numberPhone = `${numero}@c.us`;
                
                if(getMessage.ARQUIVO) {
                    const filePath = path.join(__dirname, '../../localFiles/readyMessages/', getMessage.ARQUIVO.ARQUIVO);
    
                    const media = new MessageMedia(getMessage.ARQUIVO.TIPO, fs.readFileSync(filePath).toString('base64'), getMessage.TITULO);
    
                    WhatsappWeb.sendMessage(numberPhone, media, { caption: getMessage.TEXTO_MENSAGEM});
                } else {
                    WhatsappWeb.sendMessage(numberPhone, getMessage.TEXTO_MENSAGEM);
                };
            });   
        });
    
        socket.on("finish-attendance", async(data: FinishAttendanceProps) => {
            const survey = await services.attendances.finish(data.CODIGO_ATENDIMENTO, data.CODIGO_RESULTADO, 0);
            if(survey) {
                const { registration, reply } = await surveyBot(survey, "");
                try {
                    const attendance = await getSpecificAttendance(data.CODIGO_ATENDIMENTO);
                    const number = attendance && await services.wnumbers.getById(attendance.CODIGO_NUMERO);

                    if(process.env.OFICIAL_WHATSAPP === "false") {
                        number && reply && WhatsappWeb.sendMessage(`${number.NUMERO}@c.us`, reply);
                    };
                    
                    runningSurveys.update(survey.WPP_NUMERO, registration);
                } catch (err) {
                    console.log(new Date().toLocaleString(), ": error on survey: ", err);
                };
            };
        });
    
        socket.on("start-attendance", async(data: { cliente: number, numero: number, wpp: string, pfp: string }) => {
            const operator = Sessions.value.find(s => s.sessions.includes(socket.id));
    
            const client = await services.customers.getOneById(data.cliente);
            const number = await services.wnumbers.getById(data.numero);
    
            if(operator && client && number){
                services.attendances.startNew({
                    client: client,
                    number: number,
                    operator: operator
                });
            };
        });
    
        socket.on("schedule-attendance", async(data: { CODIGO_ATENDIMENTO: number, DATA_AGENDAMENTO: Date }) => {
            await services.attendances.updateSchedulesDate(data.CODIGO_ATENDIMENTO, data.DATA_AGENDAMENTO, "ALTA");
        });
    
        socket.on("update-operator", async(data: { CODIGO_ATENDIMENTO: number, CODIGO_OPERADOR: number }) => {
            services.attendances.updateOp(data.CODIGO_ATENDIMENTO, data.CODIGO_OPERADOR);
        });
    
        socket.on("update-urgencia", (data: { CODIGO_ATENDIMENTO: number, URGENCIA: SupervisorUrgency | ScheduleUrgency | OperatorUrgency, mode: "Supervisor" | "Operator"}) => {
            services.attendances.updateUrgencia(data.CODIGO_ATENDIMENTO, data.URGENCIA, data.mode);
        });
    });
};

export default WhatsappWeb;