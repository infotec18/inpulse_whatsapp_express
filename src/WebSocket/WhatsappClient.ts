import { Client, LocalAuth } from "whatsapp-web.js";
import WebSocket from ".";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import { Sessions } from "./sessions";
import { Attendance } from "../entities/attendance.entity";
import { RunningAttendance, RunningRegistration } from "../interfaces/attendances.interfaces";
import { registrationBot } from "../bots/registration.bot";
import { Message } from "../entities/message.entity";
import { WhatsappMessage } from "../interfaces/messages.interfaces";
import { Repository, SelectQueryBuilder } from "typeorm";
import { AppDataSource } from "../data-source";
import { ReadStream } from "typeorm/platform/PlatformTools";

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

async function runQuery() {
    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const query: SelectQueryBuilder<Attendance> = AttendanceRepository.createQueryBuilder('atendimentos').select();
    const stream: Promise<ReadStream> = query.stream();
  
    stream.then((readStream: ReadStream) => {
      readStream.on('data', (attendance: Attendance) => {
        console.log(attendance);
      });
    });
  };
  
setTimeout(() => {
    runQuery();
}, 5000);





let RunningAttendances: Array<RunningAttendance> = [];
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
    let registrating = RunningRegistrations.find(r => r.WPP_NUMERO === number && !r.CONCLUIDO);
    
    if(registrating) {

        const { registration, reply } = await registrationBot(registrating, message.body);
        reply && message.reply(reply);

        let index = RunningRegistrations.findIndex(r => r.WPP_NUMERO === number);
        RunningRegistrations[index] = registration;

        if(registration.CONCLUIDO) {
            RunningRegistrations = RunningRegistrations.filter(r => !r.CONCLUIDO);
        };

    } else if(!isMe) {
    // Caso a mensagem não seja minha (mensagem recebida):
        // Tenta encontrar o número na base de dados...
        const findNumber: Wnumber | null = await services.wnumbers.find(number);
        console.log(findNumber);

        if(findNumber) {
        // Caso encontre o número
            // Tenta encontrar um atendimento para esse número (não concluído)
            const findCustomer = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance = await services.attendances.find(findNumber.CODIGO_CLIENTE);

           if(findAttendance) {
            // Caso encontre um atendimento para este número...
            const newMessage: Message = await services.messages.create(message as unknown as WhatsappMessage, findAttendance.CODIGO);

            } else {
                // Caso não encontre um atendimento para este número...
                    // Cria um novo atendimento:
                    const newAttendance: Attendance = await services.attendances.create({
                        CODIGO_OPERADOR: findCustomer.OPERADOR || 0,
                        CODIGO_CLIENTE: findNumber.CODIGO_CLIENTE,
                        CODIGO_NUMERO: findNumber.CODIGO,
                        CONCUIDO: 0,
                        DATA_INICIO: new Date(),
                        DATA_FIM: null
                    }); 

                    const newMessage: Message = await services.messages.create(message as unknown as WhatsappMessage, newAttendance.CODIGO);

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
    };
});

export default WhatsappWeb;