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
exports.downloadFileService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const data_source_1 = require("../../data-source");
const messageFile_entity_1 = require("../../entities/messageFile.entity");
const errors_1 = require("../../errors");
function downloadFileService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const messagesFilesRepository = data_source_1.AppDataSource.getRepository(messageFile_entity_1.MessageFile);
        const file = yield messagesFilesRepository.findOneBy({ CODIGO: Number(req.params.id) });
        if (!file)
            throw new errors_1.AppError("File not found.", 404);
        const filePath = path_1.default.join(__dirname, `../../../localFiles/messages`, file.ARQUIVO);
        if (fs_1.default.existsSync(filePath)) {
            res.setHeader('Content-Disposition', `attachment; filename=${file.ARQUIVO}`);
            res.setHeader('Content-Type', 'application/octet-stream');
            return filePath;
        }
        else {
            throw new errors_1.AppError("File not found.", 404);
        }
    });
}
exports.downloadFileService = downloadFileService;
;
