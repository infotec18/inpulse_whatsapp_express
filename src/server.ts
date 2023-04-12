import app from "./app";
import { AppDataSource } from "./data-source";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb, { getRunningAttendances } from "./WebSocket/WhatsappClient";
import { cron } from "./job/updateAttendanceStatus.job";

const PORT: number = Number(process.env.PORT) || 8000;
const SOCKET_PORT: number = Number(process.env.SOCKET_PORT) || 5000;

async function initialize () {
    await AppDataSource.initialize()
    console.log('Database connected.');

    WebSocket.listen(SOCKET_PORT, { cors: {
        origin: "*",
        methods: ["GET", "POST"]
    } });

    console.log(`Socket.io server is running on http://localhost:${SOCKET_PORT}`);

    app.listen(PORT, () => {
        console.log(`App is running on http://localhost:${PORT}`);
    });
    
    await WhatsappWeb.initialize().then(_ => console.log("Whatsapp Initialized"));
    getRunningAttendances();
};
cron;

initialize();