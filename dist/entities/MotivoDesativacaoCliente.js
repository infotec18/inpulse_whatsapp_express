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
exports.MotivoDesativacaoCliente = void 0;
const typeorm_1 = require("typeorm");
let MotivoDesativacaoCliente = class MotivoDesativacaoCliente {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MotivoDesativacaoCliente.prototype, "OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MotivoDesativacaoCliente.prototype, "CLIENTE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MotivoDesativacaoCliente.prototype, "DATAHORA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', collation: 'latin1_swedish_ci' }),
    __metadata("design:type", String)
], MotivoDesativacaoCliente.prototype, "MOTIVO", void 0);
MotivoDesativacaoCliente = __decorate([
    (0, typeorm_1.Entity)()
], MotivoDesativacaoCliente);
exports.MotivoDesativacaoCliente = MotivoDesativacaoCliente;
