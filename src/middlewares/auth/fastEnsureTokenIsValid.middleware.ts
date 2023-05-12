import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { AppError } from "../../errors";

export function fastEnsureTokenIsValid (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) throw new AppError("Missing authorization token.", 400);

    Jwt.verify(token, process.env.JWT__SECRET_KEY!, (error, decoded: any) => {
        if (error) throw new AppError(error.message, 401);
        if (decoded.CODIGO) { req.user = { CODIGO: Number(decoded.CODIGO), isAdmin: Boolean(decoded.isAdmin) }};
    });

    next();
}