import { compare } from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";

export async function loginUserService(username: string, password: string): Promise<User> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);

    const findUser: User | null = await usersRepository.findOneBy({ LOGIN: username });

    if(!findUser) throw new AppError("Invalid login.", 404);

    const isPasswordCorrect: boolean = await compare(password, findUser.SENHA);

    if(!isPasswordCorrect) throw new AppError("Invalid password.", 401);

    return findUser;
};