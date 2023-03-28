import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import services from "../../services";

export const updateUserController = async (req: Request, res: Response) => {
    const updated: User = await services.users.update(req.findUser, req.body);

    return res.status(200).json(updated);
};