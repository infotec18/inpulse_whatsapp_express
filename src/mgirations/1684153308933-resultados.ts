import { MigrationInterface, QueryRunner } from "typeorm";

export class Resultados1684153308933 implements MigrationInterface {
    name = 'Resultados1684153308933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ACAO\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_URGENCIA_AGENDAMENTO\` enum ('MUITO_ALTA', 'ALTA', 'MEDIA', 'NORMAL') NULL`);
        await queryRunner.query(`ALTER TABLE \`resultados\` ADD \`WHATS_ALTERAR_AGENDAMENTO\` tinyint NOT NULL DEFAULT 0`);
1    };

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resultados\` DROP COLUMN \`WHATS_ALTERAR_AGENDAMENTO\``);
        await queryRunner.query(`ALTER TABLE \`resultados\` DROP COLUMN \`WHATS_URGENCIA_AGENDAMENTO\``);
        await queryRunner.query(`ALTER TABLE \`resultados\` DROP COLUMN \`WHATS_ACAO\``);
    };
};
