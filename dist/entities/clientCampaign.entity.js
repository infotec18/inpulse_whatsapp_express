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
exports.ClientCampaign = void 0;
const typeorm_1 = require("typeorm");
let ClientCampaign = class ClientCampaign {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "CODIGO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "CLIENTE", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "OPERADOR", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "OPERADOR_LIGACAO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "CAMPANHA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, default: '0000-00-00' }),
    __metadata("design:type", Date)
], ClientCampaign.prototype, "DT_RESULTADO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true, default: '0000-00-00 00:00:00' }),
    __metadata("design:type", Date)
], ClientCampaign.prototype, "DT_AGENDAMENTO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true, default: '0000-00-00 00:00:00' }),
    __metadata("design:type", Object)
], ClientCampaign.prototype, "DATA_HORA_LIG", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true, default: '0000-00-00 00:00:00' }),
    __metadata("design:type", Object)
], ClientCampaign.prototype, "DATA_HORA_FIM", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], ClientCampaign.prototype, "RESULTADO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['SIM', 'NAO'], nullable: true, default: null }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "CONCLUIDO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12 }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "TELEFONE_LIGADO", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1, nullable: true }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "FIDELIZA", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, nullable: true, default: '' }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "FONE1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, nullable: true, default: '' }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "FONE2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 12, nullable: true, default: '' }),
    __metadata("design:type", String)
], ClientCampaign.prototype, "FONE3", void 0);
ClientCampaign = __decorate([
    (0, typeorm_1.Entity)('campanhas_clientes')
], ClientCampaign);
exports.ClientCampaign = ClientCampaign;
;
