import app from "./app";
import { AppDataSource } from "./data-source";
import { cronJob } from "./job/updateAttendanceStatus.job";
import services from "./services";
import { oficialApiFlow } from "./WebSocket/OficialApi";
import { Sessions } from "./WebSocket/Sessions";
import WebSocket from "./WebSocket/WebSocket";
import WhatsappWeb, { getRunningAttendances, runningAttendances } from "./WebSocket/WhatsappClient";

const PORT: number = Number(process.env.PORT) || 8000;
const SOCKET_PORT: number = Number(process.env.SOCKET_PORT) || 5000;

async function initialize () {
    await AppDataSource.initialize()
    console.log(new Date().toLocaleString(), ': Database connected.');

    WebSocket.listen(SOCKET_PORT, { cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }});

    console.log(new Date().toLocaleString(), `: Socket.io server is running on http://localhost:${SOCKET_PORT}`);

    app.listen(PORT, () => {
        console.log(new Date().toLocaleString(), `: App is running on http://localhost:${PORT}`);
    });
    
    const useOficialApi = process.env.OFICIAL_WHATSAPP === "true";

    if(!useOficialApi) {
        console.log(new Date().toLocaleString(), ": Utilizando biblioteca Whatsapp Web JS.");
        await WhatsappWeb.initialize().then(_ => console.log(new Date().toLocaleString(), ": Whatsapp Initialized"));

    } else {
        oficialApiFlow
        console.log(new Date().toLocaleString(), ": Utilizando API Oficial do Whatsapp.");
    }

    await getRunningAttendances();

    const allOperators = await services.users.getAll(9999, 1, "");
    const filteredOperators = allOperators.dados.filter(o => o.NIVEL !== "ADMIN" && o.CODIGO > 0);

    for(const op of filteredOperators) {
        await Sessions.addSession(op.CODIGO, null);
    };

    const operators = Array.from(new Set(runningAttendances.value.map(r => r.CODIGO_OPERADOR)));

    operators.forEach(async(o) => {
        const attendances = runningAttendances.getAttendancesNumber(o);
        Sessions.updateOperatorRunningAttendances(o, attendances);
    });
 
    cronJob;
};

initialize();