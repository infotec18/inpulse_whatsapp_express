import { Request, Response } from "express";
import services from "../../services";

export const loginUserController = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    const findUser = await services.users.login(name, password);

    return res.status(200).json(findUser);
};