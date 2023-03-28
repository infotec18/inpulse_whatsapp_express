import { Request, Response } from "express";
import services from "../../services";

export const createUserController = async (req: Request, res: Response) => {
    const newUser = await services.users.create(req);

    return res.status(201).json(newUser);
};