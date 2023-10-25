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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const wnumber_entity_1 = require("./wnumber.entity");
let Customer = class Customer {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '100' }),
    __metadata("design:type", String)
], Customer.prototype, "RAZAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '60' }),
    __metadata("design:type", String)
], Customer.prototype, "FANTASIA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['FIS', 'JUR'], default: 'JUR' }),
    __metadata("design:type", String)
], Customer.prototype, "PESSOA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['SIM', 'NAO'], default: 'SIM' }),
    __metadata("design:type", String)
], Customer.prototype, "ATIVO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '16' }),
    __metadata("design:type", String)
], Customer.prototype, "CPF_CNPJ", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: '0000-00-00 00:00:00' }),
    __metadata("design:type", Date)
], Customer.prototype, "DATACAD", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: '0000-00-00' }),
    __metadata("design:type", String)
], Customer.prototype, "ULTI_RESULTADO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: '0000-00-00' }),
    __metadata("design:type", String)
], Customer.prototype, "DT_AGENDAMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: '20', default: null }),
    __metadata("design:type", Object)
], Customer.prototype, "COD_ERP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Customer.prototype, "OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Customer.prototype, "ORIGEM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Customer.prototype, "AREA1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12 }),
    __metadata("design:type", String)
], Customer.prototype, "FONE1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Customer.prototype, "DESC_FONE1", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wnumber_entity_1.Wnumber, wnumber => wnumber.CLIENTE, { cascade: true }),
    __metadata("design:type", Array)
], Customer.prototype, "TELEFONES", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)('clientes')
], Customer);
exports.Customer = Customer;
;
