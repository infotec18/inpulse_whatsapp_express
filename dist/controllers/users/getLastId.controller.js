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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastUserIdController = void 0;
const services_1 = __importDefault(require("../../services"));
const getLastUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - (1000 * 60 * 60 * 24 * 1));
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(Date.now() + (1000 * 60 * 60 * 24 * 1));
    const { vendasPorEstado, motivos_pausa } = yield services_1.default.users.getLastId(startDate, endDate);
    return res.status(200).json({ vendasPorEstado, motivos_pausa });
});
exports.getLastUserIdController = getLastUserIdController;
