import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import { recoverUserService } from "../../services/users/recover.service";

export const recoverUserController = async (req: Request, res: Response) => {
    const deletedUser: User = await recoverUserService(req.findUser);

    return res.status(200).json(deletedUser);
};