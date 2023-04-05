import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Avatar } from "../../entities/avatar.entity";

export async function insertUserAvatarService(userId: number, data: string): Promise<Avatar> {

    const avatarsRepository: Repository<Avatar> = AppDataSource.getRepository(Avatar);
    const alreadyExists: Avatar | null = await avatarsRepository.findOneBy({ CODIGO_OPERADOR: userId });

    if(alreadyExists) {
        const insertedAvatar: Avatar | null = await avatarsRepository.save({
            CODIGO: alreadyExists.CODIGO,
            CODIGO_OPERADOR: userId,
            ARQUIVO: data
        });

        return insertedAvatar;

    } else {
        const insertedAvatar: Avatar | null = await avatarsRepository.save({
            CODIGO_OPERADOR: userId,
            ARQUIVO: data
        }); 

        return insertedAvatar;
    }
};