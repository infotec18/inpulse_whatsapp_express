"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureParamCustomerIdExists = void 0;
const errors_1 = require("../../errors");
const getOneById_service_1 = require("../../services/customers/getOneById.service");
function ensureParamCustomerIdExists(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = Number(req.params.userId);
        if (isNaN(userId))
            throw new errors_1.AppError("Invalid user id.", 400);
        const findCustomer = yield (0, getOneById_service_1.getOneCustomersService)(userId);
        if (!findCustomer)
            throw new errors_1.AppError("Customer not found", 404);
        req.findCustomer = findCustomer;
        next();
    });
}
exports.ensureParamCustomerIdExists = ensureParamCustomerIdExists;
