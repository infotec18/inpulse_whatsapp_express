import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";

export async function createUserService(req: Request): Promise<User> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);
    const hashedPassword: string = await hash(req.body.SENHA, 10);

    const newUser = await usersRepository.save({ ...req.body, SENHA: hashedPassword });

    return newUser
};