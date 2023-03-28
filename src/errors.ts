import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    };
};

export function errorHandler(error: Error, req: Request, res: Response, _: NextFunction): Response {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    };

    if (error instanceof ZodError) {
        return res.status(400).json({ message: error.flatten().fieldErrors });
    };

    console.error(error);

    return res
        .status(500)
        .json({ message: error.message });
};