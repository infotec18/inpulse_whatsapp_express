import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function updateOperator(cod: number, operator: number): Promise<void> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    let findAttendance = await AttendancesRepository.findOneBy({ CODIGO: cod });

    if(findAttendance) {
        findAttendance.CODIGO_OPERADOR = operator;

        await AttendancesRepository.save(findAttendance);
        console.log(cod, operator)
    }
};
