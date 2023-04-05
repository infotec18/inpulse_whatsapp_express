import { ensureParamNumberIdExists } from "./Wnumber/ensureParamWnumberIdExists.middleware";
import { ensureTokenIsValid } from "./auth/ensureTokenIsValid.middleware";
import { ensureParamCustomerIdExists } from "./customers/ensureParamCustomerIdExists.middleware";
import { ensureParamReadyMessagesIdExists } from "./readyMessages/ensureParamReadyMessageIdExists.middleware";
import { ensureParamUserIdExists } from "./users/ensureParamUserIdExists.middleware";

const middlewares = {
    auth: {
        ensureTokenIsValid
    },
    users: {
        ensureParamUserIdExists
    },
    customers: {
        ensureParamCustomerIdExists
    },
    wnumbers: {
        ensureParamNumberIdExists
    },
    readyMessages: {
        ensureParamReadyMessagesIdExists
    }
};

export default middlewares;