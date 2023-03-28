import { Request } from "express"
import { User } from "../../entities/user.entity"

declare global {
    namespace Express {
        interface Request {
            user: {
                CODIGO: number,
                isAdmin: boolean
            },
            findUser: User
        }
    }
}