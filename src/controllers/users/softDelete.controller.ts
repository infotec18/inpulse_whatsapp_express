import { Request, Response } from "express";
import { User } from "../../entities/user.entity";
import services from "../../services";

export const softDeleteUserController = async (req: Request, res: Response) => {
    const deletedUser: User = await services.users.softDelete(req.findUser);

    return res.status(200).json(deletedUser);
};