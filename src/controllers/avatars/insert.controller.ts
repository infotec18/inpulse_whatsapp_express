import { Request, Response } from "express";
import services from "../../services";

export const insertUserAvatarController = async (req: Request, res: Response) => {

    const newAvatar = await services.avatars.insert(req.findUser.CODIGO, req.body.ARQUIVO);

    return res.status(201).json(newAvatar);
};