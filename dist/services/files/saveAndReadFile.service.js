"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAndReadFile = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function saveAndReadFile(file) {
    return new Promise((resolve) => {
        const fileContent = Buffer.from(file.buffer);
        const savePath = path_1.default.join(__dirname, '../../../localFiles/messages', file.name);
        (0, fs_1.writeFileSync)(savePath, fileContent);
        setTimeout(() => {
            const readStream = (0, fs_1.createReadStream)(savePath);
            resolve(readStream);
        }, 5000);
    });
}
exports.saveAndReadFile = saveAndReadFile;
;
