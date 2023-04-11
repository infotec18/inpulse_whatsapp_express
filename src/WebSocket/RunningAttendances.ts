import { RunningAttendance } from "../interfaces/attendances.interfaces";
import { Sessions } from "./Sessions";
import WebSocket from "./WebSocket";

export class RunningAttendances {
    value: Array<RunningAttendance> = [];

    constructor(value: Array<RunningAttendance>) {
        this.value = value;
    }

    update(COD_ATENDIMENTO: number, PARAMS: Partial<RunningAttendance>) {
        const index = this.value.findIndex((a) => a.CODIGO_ATENDIMENTO === COD_ATENDIMENTO);
        if(index > -1) this.value[index] = { ...this.value[index], ...PARAMS };
    };

    create(NEW_RA: RunningAttendance) {
        this.value.push(NEW_RA);
    };

    find(PARAMS: Partial<RunningAttendance>) {
        console.log("try to find")
        const entries = Object.entries(PARAMS);
        console.log(entries)
        const find = this.value.find(ra => {
            const booleanArr: boolean[] = entries.map(e => {
                const key = e[0] as keyof RunningAttendance
                const value = e[1]
                return ra[key] === value;
            });

            return !booleanArr.includes(false);
        });
        console.log(find)
        return find;
    };

    remove(COD_ATENDIMENTO: number) {
        this.value = this.value.filter(ra => ra.CODIGO_ATENDIMENTO !== COD_ATENDIMENTO);
    };

    returnOperatorAttendances(COD_OPERADOR: number, socketId?: string) {
        console.log(this.value);
        const operatorAttendances = this.value.filter(a => a.CODIGO_OPERADOR === COD_OPERADOR);
        console.log("Enviando atendimentos atualizados: ", operatorAttendances);

        if(socketId) WebSocket.to(socketId).emit("load-attendances", operatorAttendances);
        else {
            const sessions = Sessions.filter(s => s.userId === COD_OPERADOR);
            sessions.forEach(s => {
                WebSocket.to(s.socketId).emit("load-attendances", operatorAttendances);
            });
        };
    };
};