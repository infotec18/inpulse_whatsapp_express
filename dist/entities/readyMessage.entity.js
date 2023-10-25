"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyMessage = void 0;
const typeorm_1 = require("typeorm");
const readyMessageFile_entity_1 = require("./readyMessageFile.entity");
let ReadyMessage = class ReadyMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReadyMessage.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], ReadyMessage.prototype, "APENAS_ADMIN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ReadyMessage.prototype, "TEXTO_MENSAGEM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ReadyMessage.prototype, "TITULO", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => readyMessageFile_entity_1.ReadyMessageFile, file => file.MENSAGEM),
    __metadata("design:type", readyMessageFile_entity_1.ReadyMessageFile)
], ReadyMessage.prototype, "ARQUIVO", void 0);
ReadyMessage = __decorate([
    (0, typeorm_1.Entity)('mensagens_prontas')
], ReadyMessage);
exports.ReadyMessage = ReadyMessage;
