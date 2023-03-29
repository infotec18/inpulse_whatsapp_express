import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { User } from "../../entities/user.entity";

export async function findAttendancesByUserService(COD: number): Promise<{ OPERADOR: User, ATENDIMENTOS: Attendance[]}> {

    const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const UserRepository: Repository<User> = AppDataSource.getRepository(User);

    const findOperator: User | null = await UserRepository.findOneBy({ CODIGO: COD })
    const findAttendances: Attendance[] = await AttendanceRepository.findBy({
        CODIGO_OPERADOR: COD
    });

    return { OPERADOR: findOperator!, ATENDIMENTOS: findAttendances };
};