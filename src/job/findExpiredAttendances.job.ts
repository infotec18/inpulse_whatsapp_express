import { runningAttendances } from "../WebSocket/WhatsappClient";
import * as cron from "node-cron";

// Define o cron job para ser executado a cada 30 minutos;
export const findExpiredAttendancesJob = cron.schedule('*/30 * * * *', () => {
    console.log(new Date().toLocaleString(), ": Verificando atendimentos expirados...");

    runningAttendances.value.forEach(a => {
        const startDate = a.DATA_INICIO;
        const maxDate = new Date(startDate);
        maxDate.setDate(maxDate.getDate() + 3);
        const nowDate = new Date();

        if(nowDate >= maxDate && !a.EXPIRADO) {
            runningAttendances.update(a.CODIGO_ATENDIMENTO, { EXPIRADO: true });
            console.log(new Date().toLocaleString(), `Atendimento CODIGO: ${a.CODIGO_ATENDIMENTO} está expirado.`);
        };
    });

});