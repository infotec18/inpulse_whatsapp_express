import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function createAttendanceService(params: any): Promise<void> {
  const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
  
  await AttendanceRepository.insert(params)
}