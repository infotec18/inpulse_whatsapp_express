import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Avatar } from "../../entities/avatar.entity";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { Response } from "express";

export async function getOneAvatarByUserIdService(userId: number, res: Response) {

    const avatarsRepository: Repository<Avatar> = AppDataSource.getRepository(Avatar);

    const findAvatar: Avatar | null = await avatarsRepository.findOneBy({
        CODIGO_OPERADOR: userId
    });

    if(!findAvatar) {
        await avatarsRepository.save({
            CODIGO_OPERADOR: userId
        });

        return "";
    } else if(!findAvatar.ARQUIVO){
        
        return "";
    } else {
        const filePath = path.join(__dirname, `../../../localFiles/avatars`, findAvatar.ARQUIVO);

        if(findAvatar.ARQUIVO && existsSync(filePath)) {  
            const data = readFileSync(filePath);
            const base64 = Buffer.from(data).toString('base64');
            const ext = findAvatar.ARQUIVO.split(".")[1]
            const dataUrl = `data:image/${ext};base64,${base64}`;
    
            return dataUrl;

        } else {
            return "";
        };
    };
};