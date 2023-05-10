import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function createAttendanceService(params: Partial<Attendance>): Promise<Attendance> {
  const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
  const newAttendance: Attendance = await AttendanceRepository.save(params);

  return newAttendance;
};