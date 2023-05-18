import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { AppError } from "../../errors";

export async function cancelAttendanceScheduleService(CODIGO_ATENDIMENTO: number) {
    const attendanceRepository = AppDataSource.getRepository(Attendance);

    const findAttendance = await attendanceRepository.findOneBy({ CODIGO: CODIGO_ATENDIMENTO });

    if(!findAttendance) throw new AppError("Atendimento não encontrado...", 404);
    if(!findAttendance.DATA_AGENDAMENTO) throw new AppError("O atendimento não possuí agendamento.", 400);

    findAttendance.DATA_AGENDAMENTO = null;
    findAttendance.DATA_FIM = new Date();
    findAttendance.CONCLUIDO = 1;
    
    await attendanceRepository.save(findAttendance);

    return "Agendamento cancelado com sucesso!";
};