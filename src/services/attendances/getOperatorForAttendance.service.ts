import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { Session } from "../../interfaces/attendances.interfaces";
import { Sessions } from "../../WebSocket/Sessions";

export async function getOperatorForAttendance(cod_o: number): Promise<Session | undefined> {
    
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const findOperatorSession: Session | undefined = Sessions.find(s => s.userId === cod_o);

    if(!findOperatorSession) {
        let arr: Array<{ session: Session, count: number }> = []

         await Promise.all(Sessions.map(async(s) => {
            if(!s.admin) {
                const find = await AttendancesRepository.findAndCountBy({
                    CONCLUIDO: 0, CODIGO_OPERADOR: s.userId
                });
                arr.push({ session: s, count: find[1]})
            };
        }));
        
        const countArr: number[] = arr.map(i => i.count);
        const minCount: number = Math.min(...countArr);
        const findMin = arr.find((item) => item.count === minCount);

        return findMin?.session;
    } else { 
        
        return findOperatorSession;
    };
    
};