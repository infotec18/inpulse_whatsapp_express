import { MigrationInterface, QueryRunner } from "typeorm";

export class OpMessages1682664413875 implements MigrationInterface {
    name = 'OpMessages1682664413875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagens\` ADD \`CODIGO_OPERADOR\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` ADD CONSTRAINT \`FK_e4bf0a53dc4657e2b1a87cb4f80\` FOREIGN KEY (\`CODIGO_OPERADOR\`) REFERENCES \`operadores\`(\`CODIGO\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagens\` DROP FOREIGN KEY \`FK_e4bf0a53dc4657e2b1a87cb4f80\``);
        await queryRunner.query(`ALTER TABLE \`mensagens\` DROP COLUMN \`CODIGO_OPERADOR\``);
    }

}
