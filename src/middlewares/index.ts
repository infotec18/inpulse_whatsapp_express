import { ensureTokenIsValid } from "./auth/ensureTokenIsValid.middleware";

const middlewares = {
    auth: {
        ensureTokenIsValid
    }
};

export default middlewares;