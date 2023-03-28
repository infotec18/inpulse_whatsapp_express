import { ensureTokenIsValid } from "./auth/ensureTokenIsValid.middleware";
import { ensureParamUserIdExists } from "./users/ensureParamUserIdExists.middleware";

const middlewares = {
    auth: {
        ensureTokenIsValid
    },
    users: {
        ensureParamUserIdExists
    }
};

export default middlewares;