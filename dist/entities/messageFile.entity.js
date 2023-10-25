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
exports.MessageFile = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
let MessageFile = class MessageFile {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessageFile.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], MessageFile.prototype, "CODIGO_MENSAGEM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MessageFile.prototype, "TIPO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MessageFile.prototype, "ARQUIVO", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => message_entity_1.Message, message => message.ARQUIVO),
    (0, typeorm_1.JoinColumn)({ name: 'CODIGO_MENSAGEM' }),
    __metadata("design:type", message_entity_1.Message)
], MessageFile.prototype, "MENSAGEM", void 0);
MessageFile = __decorate([
    (0, typeorm_1.Entity)('mensagens_arquivos')
], MessageFile);
exports.MessageFile = MessageFile;
;
