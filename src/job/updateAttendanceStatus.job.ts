import { updateAttendanceStatus } from "../services/attendances/scheduleAttendanceStatus.service";
import * as cron from "node-cron";

// Define o cron job para ser executado a cada 15 minutos
export const cronJob = cron.schedule('*/1 * * * *', () => {
  updateAttendanceStatus();
});
