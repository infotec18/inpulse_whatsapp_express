import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

export async function getLastUserIdService(): Promise<number> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);

    const allUsers: User[] = await usersRepository.find({
        order: {
            CODIGO: 'DESC'
        }
    });

    const lastUser: User | undefined = allUsers[0];

    if (!lastUser) throw new AppError("No user found in the database.", 404);

    return lastUser.CODIGO;
};