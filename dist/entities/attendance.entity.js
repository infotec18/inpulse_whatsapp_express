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
exports.Attendance = void 0;
const typeorm_1 = require("typeorm");
const message_entity_1 = require("./message.entity");
const tabulation_entity_1 = require("./tabulation.entity");
let Attendance = class Attendance {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Attendance.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: ['ATIVO', 'RECEP'] }),
    __metadata("design:type", String)
], Attendance.prototype, "ATIVO_RECEP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Attendance.prototype, "CODIGO_OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Attendance.prototype, "CODIGO_OPERADOR_ANTERIOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Attendance.prototype, "CODIGO_CLIENTE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Attendance.prototype, "CODIGO_NUMERO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: null }),
    __metadata("design:type", Object)
], Attendance.prototype, "CODIGO_CC", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', nullable: true, default: 0 }),
    __metadata("design:type", Object)
], Attendance.prototype, "CONCLUIDO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Attendance.prototype, "DATA_INICIO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "DATA_FIM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "DATA_AGENDAMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['URGENTE', 'MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL'], default: null, nullable: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "URGENCIA_SUPERVISOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL'], default: null, nullable: true }),
    __metadata("design:type", Object)
], Attendance.prototype, "URGENCIA_AGENDAMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['ALTA', 'MEDIA', 'NORMAL'], default: 'NORMAL' }),
    __metadata("design:type", String)
], Attendance.prototype, "URGENCIA_OPERADOR", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.ATENDIMENTO),
    __metadata("design:type", Array)
], Attendance.prototype, "MENSAGENS", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tabulation_entity_1.Tabulation, tabulation => tabulation.ATENDIMENTO),
    __metadata("design:type", Array)
], Attendance.prototype, "HISTORICO", void 0);
Attendance = __decorate([
    (0, typeorm_1.Entity)('atendimentos')
], Attendance);
exports.Attendance = Attendance;
;
