import { RunningAttendance } from "../interfaces/attendances.interfaces";
import WebSocket from "./WebSocket";

export class RunningAttendances {
    value: Array<RunningAttendance> = [];

    constructor(value: Array<RunningAttendance>) {
        this.value = value;
    };

    update(COD_ATENDIMENTO: number, PARAMS: Partial<RunningAttendance>) {
        const index = this.value.findIndex((a) => a.CODIGO_ATENDIMENTO === COD_ATENDIMENTO);
        if(index > -1) this.value[index] = { ...this.value[index], ...PARAMS };
    };

    create(NEW_RA: RunningAttendance) {
        this.value.push(NEW_RA);
    };

    find(PARAMS: Partial<RunningAttendance>) {
        const entries = Object.entries(PARAMS);
        const find = this.value.find(ra => {
            const booleanArr: boolean[] = entries.map(e => {
                const key = e[0] as keyof RunningAttendance
                const value = e[1]
                return ra[key] === value;
            });

            return !booleanArr.includes(false);
        });
        return find;
    };

    remove(COD_ATENDIMENTO: number) {
        this.value = this.value.filter(ra => ra.CODIGO_ATENDIMENTO !== COD_ATENDIMENTO);
    };

    returnOperatorAttendances(COD_OPERADOR: number) {
        const operatorAttendances = this.value.filter(a => a.CODIGO_OPERADOR === COD_OPERADOR);
        WebSocket.to(`room_operator_${COD_OPERADOR}`).emit("load-attendances", operatorAttendances);
    };
};