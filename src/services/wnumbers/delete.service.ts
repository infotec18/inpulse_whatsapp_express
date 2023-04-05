import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";

export async function deleteWNumberService(number: number): Promise<void> {

    const numbersRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);

    await numbersRepository.createQueryBuilder('clientes_numeros')
        .delete()
        .from(Wnumber)
        .where("CODIGO = :id", {id: number})
        .execute();
};