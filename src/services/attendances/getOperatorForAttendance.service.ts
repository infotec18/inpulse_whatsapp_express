import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { Session } from "../../interfaces/attendances.interfaces";
import { Sessions } from "../../WebSocket/Sessions";

export async function getOperatorForAttendance(cod_o: number): Promise<number | undefined> {
    const AttendancesRepository: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const findOperatorSession: Session | undefined = Sessions.find(s => s.userId === cod_o);
    const usersIdSet = new Set(Sessions.map(s => s.userId));

    if(!findOperatorSession) {
        let arr: Array<{ userId: number, count: number }> = []

        const promise: Promise<void> = new Promise((resolve) => {
            usersIdSet.forEach(async (id) => {
                const find = await AttendancesRepository.findAndCountBy({ CONCLUIDO: 0, CODIGO_OPERADOR: id });
                arr.push({ userId: id, count: find[1] });
                if (arr.length === usersIdSet.size) resolve(); 
            });
        });
        
        await promise;
        
        const countArr: number[] = arr.map(i => i.count);
        const minCount: number = Math.min(...countArr);
        const findMin = arr.find((item) => item.count === minCount);

        if(findMin) {
            return findMin.userId;
        }
        
    } else { 
        return findOperatorSession.userId;
    };
    
};