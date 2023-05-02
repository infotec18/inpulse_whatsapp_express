import { RunningSurvey } from "../interfaces/attendances.interfaces";

export class RunningSurveys {
    value: Array<RunningSurvey> = [];

    constructor(value: Array<RunningSurvey>) {
        this.value = value;
    };

    update(wpp: string, newValue: RunningSurvey) {
        const i = this.value.findIndex(rr => rr.WPP_NUMERO === wpp);
        if(newValue.CONCLUIDO) this.remove(newValue.WPP_NUMERO);
        else if(i) this.value[i] = newValue;
    };

    create(rr: RunningSurvey) {
        this.value.push(rr);
    };

    find(wpp: string) {
        return this.value.find(rs => rs.WPP_NUMERO === wpp);
    };

    remove(wpp: string) {
        this.value = this.value.filter(rr => rr.WPP_NUMERO !== wpp);
    };
};