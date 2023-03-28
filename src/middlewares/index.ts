import { ensureTokenIsValid } from "./auth/ensureTokenIsValid.middleware";
import { ensureParamCostumerIdExists } from "./costumers/ensureParamCostumerIdExists.middleware";
import { ensureParamUserIdExists } from "./users/ensureParamUserIdExists.middleware";

const middlewares = {
    auth: {
        ensureTokenIsValid
    },
    users: {
        ensureParamUserIdExists
    },
    costumers: {
        ensureParamCostumerIdExists
    }
};

export default middlewares;