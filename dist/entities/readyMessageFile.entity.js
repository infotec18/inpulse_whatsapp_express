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
exports.ReadyMessageFile = void 0;
const typeorm_1 = require("typeorm");
const readyMessage_entity_1 = require("./readyMessage.entity");
let ReadyMessageFile = class ReadyMessageFile {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReadyMessageFile.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ReadyMessageFile.prototype, "CODIGO_MENSAGEM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], ReadyMessageFile.prototype, "TIPO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ReadyMessageFile.prototype, "ARQUIVO", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => readyMessage_entity_1.ReadyMessage, message => message.ARQUIVO),
    (0, typeorm_1.JoinColumn)({ name: 'CODIGO_MENSAGEM' }),
    __metadata("design:type", readyMessage_entity_1.ReadyMessage)
], ReadyMessageFile.prototype, "MENSAGEM", void 0);
ReadyMessageFile = __decorate([
    (0, typeorm_1.Entity)('mensagensprontas_arquivos')
], ReadyMessageFile);
exports.ReadyMessageFile = ReadyMessageFile;
;
