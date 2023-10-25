"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAndConvertAudio = exports.returnBase64 = exports.download = void 0;
const download_service_1 = require("./download.service");
const returnBase64_service_1 = require("./returnBase64.service");
const saveAndConvertAudio_service_1 = require("./saveAndConvertAudio.service");
exports.download = download_service_1.downloadFileService;
exports.returnBase64 = returnBase64_service_1.returnBase64Service;
exports.saveAndConvertAudio = saveAndConvertAudio_service_1.saveAndConvertAudioService;
