import { BotReply, RunningSurvey } from "../interfaces/attendances.interfaces";
import { insertNewFeedbackService } from "../services/attendancesFeedbacks/insertNewFeedback.service";

export async function surveyBot(RunningSurvey: RunningSurvey, msg: string): Promise<BotReply<RunningSurvey>> {
    let reply: string | null = null;

    if(RunningSurvey.ETAPA === 1 && RunningSurvey.ETAPA_COUNT === 0) {
        RunningSurvey.ETAPA++;
        RunningSurvey.ETAPA_COUNT++;
        reply = `Seu atendimento foi finalizado! 
Por favor, digite uma nota de 0 a 5 para seu atendente:
        `;
        return { registration: RunningSurvey, reply };
    };

    if(RunningSurvey.ETAPA === 2 && !isNaN(Number(msg)) && Number(msg) >= 0 && Number(msg) <= 5) {
        RunningSurvey.ETAPA++;
        RunningSurvey.NOTA = Number(msg);

        reply = "Muito bem, agora deixe um comentário que descreva o que você achou:"

        return { registration: RunningSurvey, reply };
    };

    if(RunningSurvey.ETAPA === 3) {
        RunningSurvey.ETAPA++;
        RunningSurvey.CONCLUIDO = true;
        RunningSurvey.COMENTARIO = msg;

        reply = "Certo, usaremos seu feedback para melhorar seu atendimento. muito obrigado!"

        insertNewFeedbackService(RunningSurvey.COD_ATENDIMENTO, RunningSurvey.COMENTARIO!, RunningSurvey.NOTA!);

        return { registration: RunningSurvey, reply };
    };
    
    return { registration: RunningSurvey, reply };
};