import { Request } from "express"
import { User } from "../../entities/user.entity"
import { Customer } from "../../entities/customer"
import { Wnumber } from "../../entities/wnumber.entity"
import { ReadyMessages } from "../../entities/readyMessages.entity"
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity"

declare global {
    namespace Express {
        interface Request {
            user: {
                CODIGO: number,
                isAdmin: boolean,
                data: User
            },
            customer: {
                CODIGO: number
            },
            findUser: User,
            findCustomer: Customer,
            findNumber: Wnumber,
            findReadyMessage: ReadyMessages,
            findArchive: ReadyMessageFile,
        }
    }
}