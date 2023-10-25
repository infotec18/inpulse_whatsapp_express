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
exports.getAllCustomersService = void 0;
const data_source_1 = require("../../data-source");
const customer_1 = require("../../entities/customer");
function getAllCustomersService(limite, pagina, search) {
    return __awaiter(this, void 0, void 0, function* () {
        const customersRepository = data_source_1.AppDataSource.getRepository(customer_1.Customer);
        const customersQuery = yield customersRepository
            .createQueryBuilder('v_operadores_status');
        const [dados] = yield customersQuery.getManyAndCount();
        return { dados };
    });
}
exports.getAllCustomersService = getAllCustomersService;
;
