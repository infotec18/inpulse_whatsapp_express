import { updateAttendanceStatus } from "../services/attendances/scheduleAttendanceStatus.service";
import * as cron from "node-cron";

// Define o cron job para ser executado a cada 5 minutos;
export const cronJob = cron.schedule('*/5 * * * *', () => {
  console.log(new Date().toLocaleString(), ": Verificando agendamentos...");
  updateAttendanceStatus();
});