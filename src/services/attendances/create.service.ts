import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";

export async function createAttendanceService(params: any): Promise<Attendance> {
  console.log("parametros: ", params)
  const AttendanceRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
  const newAttendance: Attendance = await AttendanceRepository.save(params);

  console.log('NEW a');
  console.log(newAttendance);
  return newAttendance;
};