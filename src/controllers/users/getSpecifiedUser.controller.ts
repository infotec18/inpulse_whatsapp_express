import { Request, Response } from "express";
import services from "../../services";

export const getSpecifiedUserController = async (req: Request, res: Response) => {
    const findUser = await services.users.getOneById(Number(req.query.CODIGO));

    return res.status(200).json(findUser);
};