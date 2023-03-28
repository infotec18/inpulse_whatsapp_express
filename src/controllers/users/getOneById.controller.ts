import { Request, Response } from "express";
import services from "../../services";

export const getOneUserByIdController = async (req: Request, res: Response) => {

    const findUser = await services.users.getOneById(req.user.CODIGO);

    return res.status(200).json(findUser);
};