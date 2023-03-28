import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Avatar } from "../../entities/avatar.entity";

export async function insertUserAvatarService(userId: number, data: string): Promise<Avatar> {

    const avatarsRepository: Repository<Avatar> = AppDataSource.getRepository(Avatar);

    const insertedAvatar: Avatar | null = await avatarsRepository.save({
        CODIGO_OPERADOR: userId,
        ARQUIVO: data
    });

    return insertedAvatar;
};