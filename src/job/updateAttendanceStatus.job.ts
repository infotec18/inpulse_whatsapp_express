import { updateAttendanceStatus } from "../services/attendances/scheduleAttendanceStatus.service";
import * as cron from "node-cron";

// Define o cron job para ser executado a cada 15 minutos
cron.schedule('*/15 * * * *', () => {
  updateAttendanceStatus();
});
