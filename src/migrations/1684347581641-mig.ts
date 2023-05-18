import { MigrationInterface, QueryRunner } from "typeorm";

export class Mig1684347581641 implements MigrationInterface {
    name = 'Mig1684347581641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ACAO\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_URGENCIA_AGENDAMENTO\` enum ('MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL') NULL`);
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ALTERAR_AGENDAMENTO\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    
    }

}
