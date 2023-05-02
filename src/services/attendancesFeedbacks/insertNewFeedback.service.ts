import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Survey } from "../../entities/survey.entity";

export async function insertNewFeedbackService(cod_a: number, comment: string, grade: number) {
    const feedbackRepository: Repository<Survey> = AppDataSource.getRepository(Survey);

    const newFeedback = await feedbackRepository.save({
        CODIGO_ATENDIMENTO: cod_a,
        NOTA_ATENDIMENTO: grade,
        COMENTARIO: comment
    });

    return newFeedback;
};