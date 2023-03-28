import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import services from "../../services";

export const recoverUserController = async (req: Request, res: Response) => {
    const deletedUser: User = await services.users.recover(req.findUser);

    return res.status(200).json(deletedUser);
};