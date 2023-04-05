import app from "./app";
import { AppDataSource } from "./data-source";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb, { getRunningAttendances } from "./WebSocket/WhatsappClient";

const PORT: number = Number(process.env.PORT) | 8000;
async function initialize () {
    await AppDataSource.initialize()
    console.log('Database connected.');

    await WhatsappWeb.initialize().then(_ => console.log("Whatsapp Initialized"));
    WebSocket.listen(5000, { cors: {
        origin: "*",
        methods: ["GET", "POST"]
    } });

    app.listen(PORT, () => {
        console.log(`App is running on http://localhost:${PORT}`);
    });

    getRunningAttendances();
};

initialize();