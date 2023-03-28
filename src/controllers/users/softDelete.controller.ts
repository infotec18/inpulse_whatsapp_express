import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import { softDeleteUserService } from "../../services/users/softDelete.service";

export const softDeleteUserController = async (req: Request, res: Response) => {
    const deletedUser: User = await softDeleteUserService(req.findUser);

    return res.status(200).json(deletedUser);
};