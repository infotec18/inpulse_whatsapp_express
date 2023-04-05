import { Request, Response } from "express";
import services from "../../services";

export const returnBase64Controller = async(req: Request, res: Response) => {
    await services.files.returnBase64(req, res);
};