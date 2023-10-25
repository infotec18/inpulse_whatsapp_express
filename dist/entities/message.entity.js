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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
const attendance_entity_1 = require("./attendance.entity");
const messageFile_entity_1 = require("./messageFile.entity");
const user_entity_1 = require("./user.entity");
let Message = class Message {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Message.prototype, "CODIGO_ATENDIMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Message.prototype, "CODIGO_OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Message.prototype, "TIPO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, default: null }),
    __metadata("design:type", String)
], Message.prototype, "MENSAGEM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Boolean)
], Message.prototype, "FROM_ME", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Message.prototype, "DATA_HORA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Message.prototype, "TIMESTAMP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Message.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, default: null }),
    __metadata("design:type", Object)
], Message.prototype, "ID_REFERENCIA", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_entity_1.Attendance, att => att.MENSAGENS),
    (0, typeorm_1.JoinColumn)({ name: 'CODIGO_ATENDIMENTO' }),
    __metadata("design:type", attendance_entity_1.Attendance)
], Message.prototype, "ATENDIMENTO", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.MENSAGENS),
    (0, typeorm_1.JoinColumn)({ name: 'CODIGO_OPERADOR' }),
    __metadata("design:type", user_entity_1.User)
], Message.prototype, "OPERADOR", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => messageFile_entity_1.MessageFile, file => file.MENSAGEM),
    __metadata("design:type", messageFile_entity_1.MessageFile)
], Message.prototype, "ARQUIVO", void 0);
Message = __decorate([
    (0, typeorm_1.Entity)('mensagens')
], Message);
exports.Message = Message;
;
