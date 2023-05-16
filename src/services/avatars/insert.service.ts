import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Avatar } from "../../entities/avatar.entity";
import { unlink, unlinkSync, writeFile } from "fs";
import path from "path";

export async function insertUserAvatarService(userId: number, data: string): Promise<Avatar> {

    const avatarsRepository: Repository<Avatar> = AppDataSource.getRepository(Avatar);
    const alreadyExists: Avatar | null = await avatarsRepository.findOneBy({ CODIGO_OPERADOR: userId });

    const base64String = data.split(",")[1];
    const ext = data.split(";")[0].split("/")[1];

    const fileName = `Avatar_${userId}_${Date.now()}.${ext}`
    
    const fileContent = Buffer.from(base64String, 'base64');
    
    const filePath = path.join(__dirname, `../../../localFiles/avatars`, fileName);

    writeFile(filePath, fileContent, (err) => {
        if (err) throw err;
    });

    if(alreadyExists) {
        if(alreadyExists.ARQUIVO) {
            unlink(path.join(__dirname, `../../../localFiles/avatars`, alreadyExists.ARQUIVO), (err) => {
                console.log(new Date().toLocaleString(), ": ", err);
            });
        }
        
        const insertedAvatar: Avatar | null = await avatarsRepository.save({
            CODIGO: alreadyExists.CODIGO,
            CODIGO_OPERADOR: userId,
            ARQUIVO: fileName
        });

        return insertedAvatar;
    } else {
        const insertedAvatar: Avatar | null = await avatarsRepository.save({
            CODIGO_OPERADOR: userId,
            ARQUIVO: fileName
        }); 

        return insertedAvatar;
    };
};