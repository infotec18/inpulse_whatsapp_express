import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Avatar } from "../../entities/avatar.entity";
import { AppError } from "../../errors";

export async function getOneAvatarByUserIdService(userId: number): Promise<Avatar> {

    const avatarsRepository: Repository<Avatar> = AppDataSource.getRepository(Avatar);

    const findAvatar: Avatar | null = await avatarsRepository.findOneBy({
        CODIGO_OPERADOR: userId
    });

    if(!findAvatar) {
        const newAvatar = await avatarsRepository.save({
            CODIGO_OPERADOR: userId
        });
        return newAvatar;
    }

    return findAvatar;
};