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
exports.Campanha = void 0;
const typeorm_1 = require("typeorm");
let Campanha = class Campanha {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Campanha.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Campanha.prototype, "NOME", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true, default: () => '0000-00-00 00:00:00' }),
    __metadata("design:type", Date)
], Campanha.prototype, "DATA_INI", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Campanha.prototype, "MAX_RESPOSTA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Campanha.prototype, "DESCRICAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Campanha.prototype, "PRIORIDADE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Campanha.prototype, "SQL_CAMPANHA", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, enum: ['SIM', 'NAO'] }),
    __metadata("design:type", String)
], Campanha.prototype, "GERADO_LISTA", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, enum: ['SIM', 'NAO'] }),
    __metadata("design:type", String)
], Campanha.prototype, "PAUSADA", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, enum: ['SIM', 'NAO'] }),
    __metadata("design:type", String)
], Campanha.prototype, "PAUSAR_AG_PUBLICA", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, enum: ['ATIVOS', 'INAT_R', 'INAT_A', 'PROSPE'] }),
    __metadata("design:type", String)
], Campanha.prototype, "TIPO", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Campanha.prototype, "UNIDADE", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Campanha.prototype, "OPERADOR", void 0);
Campanha = __decorate([
    (0, typeorm_1.Entity)('campanhas')
], Campanha);
exports.Campanha = Campanha;
