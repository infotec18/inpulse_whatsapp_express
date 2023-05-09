import { NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs';
import { ZodError } from 'zod';
import path from 'path';

export class AppError extends Error {
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    };
};

export class ReqError extends Error {
    req: Request;

    constructor(req: Request) {
        super();
        this.req = req;
    };
};

export function errorHandler(error: Error, req: Request, res: Response, _: NextFunction): Response {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    };

    if (error instanceof ZodError) {
        return res.status(400).json({ message: error.flatten().fieldErrors });
    };

    if (error instanceof ReqError) {
        const date = new Date().toUTCString();
        const filePath = path.join(__dirname, `../../../localFiles/errors`, `${date}_error.txt`);
        writeFile('log.txt', JSON.stringify(error.req) , (err) => {
        });
    }
    console.error(error);

    return res
        .status(500)
        .json({ message: error.message });
};