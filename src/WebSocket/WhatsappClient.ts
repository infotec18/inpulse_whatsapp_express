import { Client } from "whatsapp-web.js";
import WebSocket from ".";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";

const WhatsappWeb = new Client({
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

WhatsappWeb.on("qr", (qr: string) => {
    WebSocket.emit("qr", qr);
});

WhatsappWeb.on("authenticated", (data) => {
    WebSocket.emit("authenticated", data);
});

WhatsappWeb.on("message", async (message) => {
    const isMe: boolean = message.fromMe;
    if(!isMe) {
        console.log(message);
        const str: string = message.from;
        const findNumber: Wnumber | null = await services.wnumbers.find(str.slice(0, str.length - 5));
        
        if(findNumber) {
            const findAttendance = await services.attendances.find(findNumber.CODIGO);

            if(findAttendance) {
                console.log(findAttendance);
            } else {
                console.log("Não achou, criar novo atendimento.");
            };

        } else {
            console.log("Numero não cadastrado, iniciar processo de autocadastro OU atendimento humano");
        };
        
    };
});

export default WhatsappWeb;