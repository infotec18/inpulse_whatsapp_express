import { Repository } from "typeorm";
import { Result } from "../../entities/result.entity";
import { AppDataSource } from "../../data-source";

export async function getWhatsappResultsService(): Promise<Array<Result>> {
    const ResultsRepository: Repository<Result> = AppDataSource.getRepository(Result);
    const findResults: Array<Result> = await ResultsRepository.findBy({
        UTILIZAR_AGENDA: "SIM"
    });

    return findResults;
};