import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

export async function getOneUserByIdService(id: number): Promise<User> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);

    const findUser: User | null = await usersRepository.findOneBy({
        CODIGO: id
    });

    if(!findUser) throw new AppError("User provided on token is not found.", 404);

    return findUser;
};