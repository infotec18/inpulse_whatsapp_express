import { Request, Response } from "express";
import services from "../../services";

export const getAllUsersController = async (req: Request, res: Response) => {
    const newUser = await services.users.getAll();

    return res.status(201).json(newUser);
};