import { compare } from "bcryptjs";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors";
import jwt from "jsonwebtoken";

export async function loginUserService(username: string, password: string): Promise<{ token: string }> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);

    const findUser: User | null = await usersRepository.findOneBy({ LOGIN: username });

    if(!findUser) throw new AppError("Invalid login.", 404);
    if(findUser.ATIVO === "NAO") throw new AppError("Inactive user.", 403);

    const isPasswordCorrect: boolean = await compare(password, findUser.SENHA);

    if(!isPasswordCorrect) throw new AppError("Invalid password.", 401);

    const JWTPayload = { CODIGO: findUser.CODIGO, isAdmin: findUser.NIVEL === "ADMIN"};

    return { token: jwt.sign(JWTPayload, process.env.JWT__SECRET_KEY!, { expiresIn: process.env.JWT__EXPIRES_IN! }) };

};