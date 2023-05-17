import { MigrationInterface, QueryRunner } from "typeorm";

export class AttCC1684239017474 implements MigrationInterface {
    name = 'AttCC1684239017474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`atendimentos\` ADD \`CODIGO_CC\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`atendimentos\` DROP COLUMN \`CODIGO_CC\``);
    }

}
