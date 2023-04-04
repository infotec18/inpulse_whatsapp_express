import { Request } from "express"
import { User } from "../../entities/user.entity"
import { Customer } from "../../entities/customer"
import { Wnumber } from "../../entities/wnumber.entity"
import { ReadyMessages } from "../../entities/readyMessages.entity"

declare global {
    namespace Express {
        interface Request {
            user: {
                CODIGO: number,
                isAdmin: boolean
            },
            customer: {
                CODIGO: number
            },
            findUser: User,
            findCustomer: Customer,
            findNumber: Wnumber,
            findReadyMessage: ReadyMessages
        }
    }
}