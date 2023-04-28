import { Sessions } from "../../WebSocket/Sessions";

export async function getOperatorForAttendance(cod_o: number): Promise<number | undefined> {

    const findOperatorSession = await Sessions.getOperatorSession(cod_o);

    if(!findOperatorSession) {
        const allSessions = Sessions.value;
        const countArr: number[] = allSessions.map(s => s.attendances);
        const minCount: number = Math.min(...countArr);
        const findMin = allSessions.find((s) => s.attendances === minCount);

        if(findMin) {
            return findMin.userId;
        };
        
    } else { 
        return findOperatorSession.userId;
    };
};