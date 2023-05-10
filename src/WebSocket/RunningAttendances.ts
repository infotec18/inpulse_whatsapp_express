import { RetrieveMessage, RunningAttendance } from "../interfaces/attendances.interfaces";
import { Sessions } from "./Sessions";
import WebSocket from "./WebSocket";

export class RunningAttendances {
    value: Array<RunningAttendance> = [];

    constructor(value: Array<RunningAttendance>) {
        this.value = value;
    };

    update(COD_ATENDIMENTO: number, PARAMS: Partial<RunningAttendance>) {
        const index = this.value.findIndex((a) => a.CODIGO_ATENDIMENTO === COD_ATENDIMENTO);
        if (~index) {
            this.value[index] = { ...this.value[index], ...PARAMS };
            this.emitUpdate();
            this.retrieveOperatorAttendances(this.value[index].CODIGO_OPERADOR);
        };
    };

    transferOperator(codigoAtendimento: number, novoOperador: number) {
        const index = this.value.findIndex((a) => a.CODIGO_ATENDIMENTO === codigoAtendimento);

        if (~index) {
            const operadorAtual = this.value[index].CODIGO_OPERADOR;

            if (operadorAtual !== novoOperador) {
                this.value[index].CODIGO_OPERADOR = novoOperador;
                this.retrieveOperatorAttendances(novoOperador);
                this.retrieveOperatorAttendances(operadorAtual);
            };
        };
    };

    insertNewMessage(COD_ATENDIMENTO: number, NEW_MESSAGE: RetrieveMessage) {
        const index = this.value.findIndex((a) => a.CODIGO_ATENDIMENTO === COD_ATENDIMENTO);

        if (~index) {
            const messages = this.value[index].MENSAGENS;

            // Verifica se a mensagem já existe
            if (!messages.some((m) => m.CODIGO === NEW_MESSAGE.CODIGO)) {
                messages.push(NEW_MESSAGE);
                this.value[index].MENSAGENS = messages;
                this.retrieveOperatorNewMessage(NEW_MESSAGE, this.value[index].CODIGO_OPERADOR);
            };
        };
    };

    create(NEW_RA: RunningAttendance) {
        this.value.push(NEW_RA);
        this.retrieveOperatorAttendances(NEW_RA.CODIGO_OPERADOR);
        this.emitUpdate();
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

    async remove(COD_ATENDIMENTO: number) {
        const operator = this.value.find(a => a.CODIGO_ATENDIMENTO === COD_ATENDIMENTO)?.CODIGO_OPERADOR;
        this.value = this.value.filter(ra => ra.CODIGO_ATENDIMENTO !== COD_ATENDIMENTO);
        this.emitUpdate()
        operator && this.retrieveOperatorAttendances(operator);
        const session = operator && await Sessions.getOperatorSession(operator);
        if(session) {
            Sessions.updateOperatorRunningAttendances(session.userId, session.attendances - 1);
        };
    };

    retrieveOperatorAttendances(COD_OPERADOR: number) {
        const operatorAttendances = this.value.filter(a => a.CODIGO_OPERADOR === COD_OPERADOR);
        WebSocket.to(`room_operator_${COD_OPERADOR}`).emit("load-attendances", operatorAttendances);
    };

    retrieveOperatorNewMessage(NEW_MESSAGE: RetrieveMessage, COD_OPERADOR: number) {
        WebSocket.to(`room_operator_${COD_OPERADOR}`).emit("new-message", NEW_MESSAGE);
    };

    emitUpdate() {
        WebSocket.to("attendanceRoom").emit("updateRunningAttendances", this.value);
    };
};