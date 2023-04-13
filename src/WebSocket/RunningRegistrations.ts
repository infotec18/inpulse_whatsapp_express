import { RunningRegistration } from "../interfaces/attendances.interfaces";

export class RunningRegistrations {
    value: Array<RunningRegistration> = [];

    constructor(value: Array<RunningRegistration>) {
        this.value = value;
    };

    update(wpp: string, newValue: RunningRegistration) {
        const i = this.value.findIndex(rr => rr.WPP_NUMERO === wpp);
        if(newValue.CONCLUIDO) this.remove(newValue.WPP_NUMERO);
        else if(i) this.value[i] = newValue;
    };

    create(rr: RunningRegistration) {
        this.value.push(rr);
    };

    find(PARAMS: Partial<RunningRegistration>) {
        const entries = Object.entries(PARAMS);

        const find = this.value.find(ra => {
            const booleanArr: boolean[] = entries.map(e => {
                const key = e[0] as keyof RunningRegistration
                const value = e[1]
                return ra[key] === value;
            });

            return !booleanArr.includes(false);
        });

        return find;
    };

    remove(wpp: string) {
        this.value = this.value.filter(rr => rr.WPP_NUMERO !== wpp);
    };
};