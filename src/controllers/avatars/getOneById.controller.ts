import { Request, Response } from "express";
import services from "../../services";

export const getOneAvatarByUserIdController = async (req: Request, res: Response) => {

    const findAvatar = await services.avatars.getOneById(req.user.CODIGO);

    return res.status(200).json(findAvatar);
};