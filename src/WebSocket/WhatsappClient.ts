import { Client } from "whatsapp-web.js";
import WebSocket from ".";
import { Wnumber } from "../entities/wnumber.entity";
import services from "../services";
import qrcode from 'qrcode-terminal'

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
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, {small: true})
    WebSocket.emit("qr", qr);
});

WhatsappWeb.on("authenticated", (data) => {
    WebSocket.emit("authenticated", data);
});

WhatsappWeb.on("message", async (message) => {
    const isMe: boolean = message.fromMe;

    if(!isMe) {
        const str: string = message.from;
        const findNumber: Wnumber | null = await services.wnumbers.find(str.slice(0, str.length - 5));
        
        if(findNumber) {
            const findAttendance = await services.attendances.find(findNumber.CODIGO);

            if(findAttendance) {
                WebSocket.to(findAttendance.CODIGO as unknown as string).emit("message", message.body)
            } else {
                await services.attendances.create(message)
                WebSocket.emit("message", message.body)
            };

        } else {
            await services.wnumbers.create(message.body)
            WebSocket.emit("message", message.body)
        };
    };
});

export default WhatsappWeb;