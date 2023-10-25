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
exports.Wnumber = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("./customer");
let Wnumber = class Wnumber {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Wnumber.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Wnumber.prototype, "CODIGO_CLIENTE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30 }),
    __metadata("design:type", String)
], Wnumber.prototype, "NOME", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], Wnumber.prototype, "NUMERO", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, client => client.TELEFONES, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'CODIGO_CLIENTE' }),
    __metadata("design:type", customer_1.Customer)
], Wnumber.prototype, "CLIENTE", void 0);
Wnumber = __decorate([
    (0, typeorm_1.Entity)('clientes_numeros')
], Wnumber);
exports.Wnumber = Wnumber;
;
