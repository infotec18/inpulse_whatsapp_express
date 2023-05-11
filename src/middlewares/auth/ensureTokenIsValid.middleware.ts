import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors";
import services from "../../services";

export function ensureTokenIsValid (req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if(!token) throw new AppError("Missing authorization token.", 400);

    Jwt.verify(token, process.env.JWT__SECRET_KEY!, async(error, decoded: any) => {
        
        if (error) throw new AppError(error.message, 401);
        if (decoded.CODIGO) { 
            const user = await services.users.getOneById(decoded.CODIGO);

            if(!user) throw new AppError("User not found", 404);

            req.user = { CODIGO: Number(decoded.CODIGO), isAdmin: Boolean(decoded.isAdmin), data: user }

            next();
        };
    });

}