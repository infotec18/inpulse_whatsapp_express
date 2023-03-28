import { Request } from "express"
import { User } from "../../entities/user.entity"
import { Costumer } from "../../entities/costumer.entity"

declare global {
    namespace Express {
        interface Request {
            user: {
                CODIGO: number,
                isAdmin: boolean
            },
            costumer: {
                CODIGO: number
            },
            findUser: User,
            findCostumer: Costumer
        }
    }
}