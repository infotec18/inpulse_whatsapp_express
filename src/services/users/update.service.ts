import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";

export async function updateUserService(tempo: number) {

    const usersRepository= AppDataSource.getRepository(User);
    const tempo_disponivel = await usersRepository.query(
        "UPDATE `motivos_pausa SET `TEMPO_MAX_SEG` = ? WHERE `DESCRICAO` = 'disponível'",[tempo]
      );

    return tempo_disponivel;
};

