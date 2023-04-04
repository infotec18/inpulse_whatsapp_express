import { Request, Response } from "express";
import services from "../../services";

export const getOneNumberByIdController = async (req: Request, res: Response) => {

    const findNumber = await services.wnumbers.find(req.findNumber.CODIGO.toString());

    return res.status(200).json(findNumber);
};