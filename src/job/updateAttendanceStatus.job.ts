import { updateAttendanceStatus } from "../services/attendances/scheduleAttendanceStatus.service";

export const cron = require('node-cron');

// Define o cron job para ser executado a cada 15 minutos
cron.schedule('*/15 * * * *', () => {
  updateAttendanceStatus();
});
