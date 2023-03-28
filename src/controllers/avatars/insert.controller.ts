import { Request, Response } from "express";
import services from "../../services";

export const insertUserAvatarController = async (req: Request, res: Response) => {
    const userId: number = Number(req.params.userId);
    const newAvatar = await services.avatars.insert(userId, req.body.ARQUIVO);

    return res.status(201).json(newAvatar);
};