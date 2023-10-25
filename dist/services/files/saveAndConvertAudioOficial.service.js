"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAndConvertAudioServiceOficial = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
function saveAndConvertAudioServiceOficial(file) {
    return new Promise((resolve, reject) => {
        const fileContent = Buffer.from(file.buffer);
        const i = file.type.split("").findIndex(e => e === "/");
        const j = file.type.split("").slice(i + 1).findIndex(e => e === ";");
        const ext = file.type.slice(i + 1).slice(0, j);
        const filePath = "./localFiles/messages";
        const filenameWebm = `${file.name}.${ext}`;
        const filenameOgg = `${file.name}.ogg`;
        (0, fs_1.writeFileSync)(`${filePath}/${filenameWebm}`, fileContent);
        const savePath = path_1.default.join(__dirname, '../../../localFiles/messages', filenameWebm);
        const newPath = path_1.default.join(__dirname, '../../../localFiles/messages', filenameOgg);
        (0, fluent_ffmpeg_1.default)(savePath)
            .outputOptions('-c:a', 'libopus')
            .outputOptions('-b:a', '64k')
            .outputOptions('-vbr', 'on')
            .outputOptions('-compression_level', '10')
            .outputOptions('-frame_duration', '60')
            .outputOptions('-application', 'voip')
            .output(newPath)
            .on('end', () => {
            const stream = (0, fs_1.createReadStream)(newPath);
            (0, fs_1.unlinkSync)(savePath);
            resolve(stream);
        })
            .on('error', (err) => {
            reject(err);
        })
            .run();
    });
}
exports.saveAndConvertAudioServiceOficial = saveAndConvertAudioServiceOficial;
;
