import { ensureTokenIsValid } from "./auth/ensureTokenIsValid.middleware";
import { ensureParamCustomerIdExists } from "./customers/ensureParamCustomerIdExists.middleware";
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
    }
};

export default middlewares;