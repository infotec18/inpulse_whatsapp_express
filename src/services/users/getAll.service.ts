import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";

export async function getAllUsersService(): Promise<User[]> {

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);
    const findUsers: User[] = await usersRepository.find();

    return findUsers;
};