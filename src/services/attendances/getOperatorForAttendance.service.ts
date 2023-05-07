import { Sessions } from "../../WebSocket/Sessions";

export async function getOperatorForAttendance(cod_o: number): Promise<number | undefined> {

    const findOperatorSession = await Sessions.getOperatorSession(cod_o);

    if(!findOperatorSession || findOperatorSession.status !== "online") {
        const allSessions = Sessions.value;
        const onlineSessions = allSessions.filter(s => s.status === "online");

        const findMin = onlineSessions.length > 0 ? onlineSessions.reduce((prev, current) => {
            return prev.attendances < current.attendances ? prev : current;
          }) : null;

        if(findMin) {
            return findMin.userId;
        }
    } else if(findOperatorSession && findOperatorSession.status === "online") { 
        return findOperatorSession.userId;
    };
};