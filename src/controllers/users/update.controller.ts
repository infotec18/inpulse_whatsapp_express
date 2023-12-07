import { Request, Response } from "express";
import services from "../../services";

export const updateUserController = async (req: Request, res: Response) => {

    const updated = await services.users.update(Number(req.body.params.tempo) );

    return res.status(200).json(updated);
};