import app from "./app";
import { AppDataSource } from "./data-source";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb from "./WebSocket/WhatsappClient";

const PORT: number = Number(process.env.PORT) | 8000;

AppDataSource.initialize()
    .then(async() => {
        console.log('Database connected.');

        WhatsappWeb.initialize().then(_ => console.log("Whatsapp Initialized"));
        WebSocket.listen(5000, { cors: {
            origin: "*",
            methods: ["GET", "POST"]
        } });

        app.listen(PORT, () => {
            console.log(`App is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error(err));