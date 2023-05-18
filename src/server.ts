import { readFileSync } from "fs";
import app from "./app";
import { AppDataSource } from "./data-source";
import { cronJob } from "./job/updateAttendanceStatus.job";
import services from "./services";
import { oficialApiFlow } from "./WebSocket/OficialApi";
import { Sessions } from "./WebSocket/Sessions";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb, { getRunningAttendances } from "./WebSocket/WhatsappClient";
import https from "https";
import path from "path";
import { findExpiredAttendancesJob } from "./job/findExpiredAttendances.job";

const PORT: number = Number(process.env.PORT) || 8000;
const SOCKET_PORT: number = Number(process.env.SOCKET_PORT) || 5000;

async function initialize() {

    const options = {
        key: readFileSync(path.join(__dirname,"../cert/", "chave-privada.key")),
        cert: readFileSync(path.join(__dirname,"../cert/", "certificado-autoassinado.crt"))
    };
    
    const server = https.createServer(options, app);

    await AppDataSource.initialize()
    console.log(new Date().toLocaleString(), ': Database connected.');

    WebSocket.listen(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    console.log(new Date().toLocaleString(), `: Socket.io server is running on http://localhost:${SOCKET_PORT}`);

    app.listen(80)
    server.listen(PORT, () => {
        console.log(new Date().toLocaleString(), `: App is running on http://localhost:${PORT}`);
    });

    const useOficialApi = process.env.OFICIAL_WHATSAPP === "true";

    if (!useOficialApi) {
        console.log(new Date().toLocaleString(), ": Utilizando biblioteca Whatsapp Web JS.");
        await WhatsappWeb.initialize().then(_ => console.log(new Date().toLocaleString(), ": Whatsapp Initialized"));

    } else {
        oficialApiFlow
        console.log(new Date().toLocaleString(), ": Utilizando API Oficial do Whatsapp.");
    }

    const allOperators = await services.users.getAll(9999, 1, "");
    const filteredOperators = allOperators.dados.filter(o => o.NIVEL !== "ADMIN" && o.CODIGO > 0);

    for (const op of filteredOperators) {
        await Sessions.addSession(op.CODIGO, null);
    };

    getRunningAttendances();
    cronJob;
    findExpiredAttendancesJob;
};

initialize();