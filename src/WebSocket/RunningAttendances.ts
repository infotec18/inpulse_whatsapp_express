import { RunningAttendance } from "../interfaces/attendances.interfaces";

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
        const entries = Object.entries(PARAMS);

        const find = this.value.find(ra => {
            const booleanArr: boolean[] = entries.map(e => {
                const key = e[0] as keyof RunningAttendance
                const value = e[1]
                return ra[key] === value;
            });

            return !booleanArr.includes(false);
        });

        return find
    };

    remove(COD_ATENDIMENTO: number) {
        this.value = this.value.filter(ra => ra.CODIGO_ATENDIMENTO !== COD_ATENDIMENTO);
    };
};


/* 
    CODIGO_ATENDIMENTO: number;
    CODIGO_OPERADOR: number;
    CODIGO_CLIENTE: number;
    CODIGO_NUMERO: number;
    WPP_NUMERO: string;
    MENSAGENS: RetrieveMessage[];
    AVATAR?: string;
    DATA_INICIO: Date;
*/