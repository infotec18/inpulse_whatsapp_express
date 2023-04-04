import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";

export async function getAllUsersService(limite: number, pagina: number, search: string | undefined){

    const usersRepository: Repository<User> = AppDataSource.getRepository(User);
    
    const usersQuery = await usersRepository
        .createQueryBuilder('operadores')
        .orderBy('operadores.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)

    if(search) usersQuery.where('operadores.NOME LIKE :search', {search: `%${search}%`});

    const [dados, total] = await usersQuery.getManyAndCount();

    return { dados, total }
};