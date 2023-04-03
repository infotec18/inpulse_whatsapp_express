import { Request, Response } from "express";
import services from "../../services";

export const getOneNumberByIdController = async (req: Request, res: Response) => {

    const findNumber = await services.wnumbers.getOneById(Number(req.params.numberId));

    return res.status(200).json(findNumber);
};