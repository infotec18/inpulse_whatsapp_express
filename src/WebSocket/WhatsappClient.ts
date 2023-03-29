import { Client, LocalAuth } from "whatsapp-web.js";
import WebSocket from ".";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import { Sessions } from ".";
import { User } from "../entities/user.entity";
import { Attendance } from "../entities/attendance.entity";

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

let UsersAttendances: Array<{ OPERADOR: User, ATENDIMENTOS: Attendance[] }> = [];

WhatsappWeb.on("qr", (qr: string) => {
    WebSocket.emit("qr", qr);
});

WhatsappWeb.on("authenticated", (data) => {
    WebSocket.emit("authenticated", data);
    console.log('teste')
});

WhatsappWeb.on("message", async (message) => {
    const isMe: boolean = message.fromMe;

    if(!isMe) {
        const str: string = message.from;
        const findNumber: Wnumber | null = await services.wnumbers.find(str.slice(0, str.length - 5));
        
        if(findNumber) {
            const findAttendance = await services.attendances.find(findNumber.CODIGO);

            if(findAttendance) {
                const aSession = Sessions.find(s => s.userId === findAttendance.CODIGO_OPERADOR);
                if(aSession) WebSocket.to(aSession.socketId).emit("message", message.body)
                const findChat = "procura o chat desse atendimento"

                if(findChat) {
                    /*Inserir mensagem no chat */
                } else {
                    /*Criar um chat para esse atendimento e inserir a mensagem */
                };
            } else {
                Sessions.forEach(async(s) => { 
                    let attendances = await services.attendances.findByUser(s.userId);
                    UsersAttendances.push(attendances);
                    console.log(attendances)
                })
                
                //await services.attendances.create(message);
                //WebSocket.emit("message", message.body);
            };

        } else {
            await services.wnumbers.create(message.body)
            WebSocket.emit("message", message.body)
        };
    };
});

export default WhatsappWeb;