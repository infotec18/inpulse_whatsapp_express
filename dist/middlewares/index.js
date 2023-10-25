"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensureTokenIsValid_middleware_1 = require("./auth/ensureTokenIsValid.middleware");
const ensureParamCustomerIdExists_middleware_1 = require("./customers/ensureParamCustomerIdExists.middleware");
const ensureParamUserIdExists_middleware_1 = require("./users/ensureParamUserIdExists.middleware");
const middlewares = {
    auth: {
        ensureTokenIsValid: ensureTokenIsValid_middleware_1.ensureTokenIsValid
    },
    users: {
        ensureParamUserIdExists: ensureParamUserIdExists_middleware_1.ensureParamUserIdExists
    },
    customers: {
        ensureParamCustomerIdExists: ensureParamCustomerIdExists_middleware_1.ensureParamCustomerIdExists
    },
};
exports.default = middlewares;
