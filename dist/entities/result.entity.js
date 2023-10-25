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
exports.Result = void 0;
const typeorm_1 = require("typeorm");
let Result = class Result {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'int' }),
    __metadata("design:type", Number)
], Result.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, default: '' }),
    __metadata("design:type", String)
], Result.prototype, "NOME", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: 'NAO' }),
    __metadata("design:type", String)
], Result.prototype, "UTILIZAR_AGENDA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['SIM', 'NAO'], default: 'NAO' }),
    __metadata("design:type", String)
], Result.prototype, "ECONTATO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: 'NAO' }),
    __metadata("design:type", String)
], Result.prototype, "FIDELIZARCOTACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 5 }),
    __metadata("design:type", Number)
], Result.prototype, "QTDE_FIDELIZARCOTACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true, default: "" }),
    __metadata("design:type", String)
], Result.prototype, "NOME_ACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, default: null }),
    __metadata("design:type", String)
], Result.prototype, "WHATS_ACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL'], default: null, nullable: true }),
    __metadata("design:type", Object)
], Result.prototype, "WHATS_URGENCIA_AGENDAMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Result.prototype, "WHATS_ALTERAR_AGENDAMENTO", void 0);
Result = __decorate([
    (0, typeorm_1.Entity)('resultados')
], Result);
exports.Result = Result;
;
