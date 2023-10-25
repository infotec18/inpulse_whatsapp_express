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
exports.HistoricoCli = void 0;
const typeorm_1 = require("typeorm");
let HistoricoCli = class HistoricoCli {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'CODIGO' }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CAMPANHA', length: 30, nullable: true, default: '', collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], HistoricoCli.prototype, "CAMPANHA", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ATIVO_RECEP', enum: ['ATIVO', 'RECEP'], nullable: true, collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], HistoricoCli.prototype, "ATIVO_RECEP", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OPERADOR', length: 35, nullable: true, default: '', collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], HistoricoCli.prototype, "OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DATAHORA_INICIO', type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' }),
    __metadata("design:type", Date)
], HistoricoCli.prototype, "DATAHORA_INICIO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DATAHORA_FIM', type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' }),
    __metadata("design:type", Date)
], HistoricoCli.prototype, "DATAHORA_FIM", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'RESULTADO', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "RESULTADO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TELEFONE', length: 15, nullable: true, default: '', collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], HistoricoCli.prototype, "TELEFONE", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'OBSERVACAO', type: 'text', nullable: true, collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], HistoricoCli.prototype, "OBSERVACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CLIENTE', type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "CLIENTE", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CODIGO_FASE_CONTATO', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "CODIGO_FASE_CONTATO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CC_CODIGO', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "CC_CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'MARCA', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], HistoricoCli.prototype, "MARCA", void 0);
HistoricoCli = __decorate([
    (0, typeorm_1.Entity)({ name: 'historico_cli' })
], HistoricoCli);
exports.HistoricoCli = HistoricoCli;
;
