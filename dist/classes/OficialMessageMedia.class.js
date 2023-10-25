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
exports.OficialMessageMedia = void 0;
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
class OficialMessageMedia {
    constructor(file, type) {
        this.file = null;
        this.type = null;
        this.file = file;
        this.type = type;
    }
    ;
    getMediaId() {
        return __awaiter(this, void 0, void 0, function* () {
            const form = new form_data_1.default();
            form.append('file', this.file);
            form.append('type', this.type);
            form.append('messaging_product', "whatsapp");
            const headers = form.getHeaders();
            const mediaId = yield axios_1.default.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/media`, form, {
                headers: Object.assign(Object.assign({}, headers), { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` })
            })
                .then((res) => res.data.id)
                .catch((error) => null);
            if (!mediaId)
                console.log("Failed to upload media...");
            return mediaId;
        });
    }
    ;
}
exports.OficialMessageMedia = OficialMessageMedia;
;
