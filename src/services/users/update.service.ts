import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";

export async function recoverUserService(user: User): Promise<User> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);

    const updatedUser = await usersRepository.save({ ...user, ATIVO: "SIM" });

    return updatedUser;
};