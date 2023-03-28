import { Request } from "express"

declare global {
    namespace Express {
        interface Request {
            user: {
                CODIGO: number,
                isAdmin: boolean
            }
        }
    }
}