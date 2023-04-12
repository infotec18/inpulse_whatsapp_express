import { Request, Response } from "express";
import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Wnumber } from "../../entities/wnumber.entity";

export async function getAllWNumberService(limite: number, pagina: number, search: string | undefined){

    const numberRepository: Repository<Wnumber> = AppDataSource.getRepository(Wnumber);
    
    const numbersQuery = await numberRepository
        .createQueryBuilder('clientes_numeros')
        .orderBy('clientes_numeros.CODIGO', 'ASC')
        .skip((pagina - 1) * limite)
        .take(limite)

    if(search) numbersQuery.where('clientes_numeros.NOME LIKE :search', {search: `%${search}%`});

    const [dados, total] = await numbersQuery.getManyAndCount();

    return { dados, total }
};