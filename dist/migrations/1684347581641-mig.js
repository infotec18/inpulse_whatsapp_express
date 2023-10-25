"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mig1684347581641 = void 0;
class Mig1684347581641 {
    constructor() {
        this.name = 'Mig1684347581641';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ACAO\` varchar(50) NULL`);
            yield queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_URGENCIA_AGENDAMENTO\` enum ('MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL') NULL`);
            yield queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ALTERAR_AGENDAMENTO\` tinyint NOT NULL DEFAULT 0`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Mig1684347581641 = Mig1684347581641;
