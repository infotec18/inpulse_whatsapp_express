import { MigrationInterface, QueryRunner } from "typeorm";

export class newMigration1680617887681 implements MigrationInterface {
    name = 'newMigration1680617887681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`CODIGO_MENSAGEM\` \`CODIGO_MENSAGEM\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` ADD UNIQUE INDEX \`IDX_48b1a90d0229f511c89ae23558\` (\`CODIGO_MENSAGEM\`)`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`ARQUIVO\` \`ARQUIVO\` longblob NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`CODIGO_ATENDIMENTO\` \`CODIGO_ATENDIMENTO\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`FROM_ME\` \`FROM_ME\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`TIMESTAMP\` \`TIMESTAMP\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` DROP COLUMN \`CODIGO_ATENDIMENTO\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` ADD \`CODIGO_ATENDIMENTO\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` ADD UNIQUE INDEX \`IDX_7f646676c743c35161772545a8\` (\`CODIGO_OPERADOR\`)`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` ADD UNIQUE INDEX \`IDX_2942751d1af49f32a6540b8aa7\` (\`CODIGO_CLIENTE\`)`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` ADD UNIQUE INDEX \`IDX_e96b07a3b03f5cdd5901595663\` (\`CODIGO_NUMERO\`)`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`CONCLUIDO\` \`CONCLUIDO\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`DATA_INICIO\` \`DATA_INICIO\` datetime NOT NULL DEFAULT Tue Apr 04 2023 11:18:10 GMT-0300 (Horário Padrão de Brasília)`);
        await queryRunner.query(`ALTER TABLE \`avatares\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`avatares\` ADD UNIQUE INDEX \`IDX_e98f3242b9d274eb97d145b73d\` (\`CODIGO_OPERADOR\`)`);
        await queryRunner.query(`ALTER TABLE \`avatares\` CHANGE \`ARQUIVO\` \`ARQUIVO\` longblob NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`DATACAD\` \`DATACAD\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` ADD UNIQUE INDEX \`IDX_68d2b0bd18f11ff5d41049e266\` (\`CODIGO_CLIENTE\`)`);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` ADD UNIQUE INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\` (\`NUMERO\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_48b1a90d0229f511c89ae23558\` ON \`mensagens_arquivos\` (\`CODIGO_MENSAGEM\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_02d67c2669eff6e71dd0d6a5ed\` ON \`operadores\` (\`CODIGO_ERP\`)`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` ADD CONSTRAINT \`FK_48b1a90d0229f511c89ae235581\` FOREIGN KEY (\`CODIGO_MENSAGEM\`) REFERENCES \`mensagens\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` ADD CONSTRAINT \`FK_bfc61a855f72382f855dab49f8b\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` ADD CONSTRAINT \`FK_abd3ff1160eb1148d7d39723239\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` ADD CONSTRAINT \`FK_68d2b0bd18f11ff5d41049e2664\` FOREIGN KEY (\`CODIGO_CLIENTE\`) REFERENCES \`clientes\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` DROP FOREIGN KEY \`FK_68d2b0bd18f11ff5d41049e2664\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` DROP FOREIGN KEY \`FK_abd3ff1160eb1148d7d39723239\``);
        await queryRunner.query(`ALTER TABLE \`mensagens\` DROP FOREIGN KEY \`FK_bfc61a855f72382f855dab49f8b\``);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` DROP FOREIGN KEY \`FK_48b1a90d0229f511c89ae235581\``);
        await queryRunner.query(`DROP INDEX \`REL_48b1a90d0229f511c89ae23558\` ON \`mensagens_arquivos\``);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` DROP INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\``);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` DROP INDEX \`IDX_68d2b0bd18f11ff5d41049e266\``);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`avatares\` CHANGE \`ARQUIVO\` \`ARQUIVO\` longblob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`avatares\` DROP INDEX \`IDX_e98f3242b9d274eb97d145b73d\``);
        await queryRunner.query(`ALTER TABLE \`avatares\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`DATA_INICIO\` \`DATA_INICIO\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`CONCLUIDO\` \`CONCLUIDO\` tinyint(1) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` DROP INDEX \`IDX_e96b07a3b03f5cdd5901595663\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` DROP INDEX \`IDX_2942751d1af49f32a6540b8aa7\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` DROP INDEX \`IDX_7f646676c743c35161772545a8\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` DROP COLUMN \`CODIGO_ATENDIMENTO\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` ADD \`CODIGO_ATENDIMENTO\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`TIMESTAMP\` \`TIMESTAMP\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`FROM_ME\` \`FROM_ME\` tinyint(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`CODIGO_ATENDIMENTO\` \`CODIGO_ATENDIMENTO\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`ARQUIVO\` \`ARQUIVO\` longblob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` DROP INDEX \`IDX_48b1a90d0229f511c89ae23558\``);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`CODIGO_MENSAGEM\` \`CODIGO_MENSAGEM\` int(10) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` CHANGE \`CODIGO\` \`CODIGO\` int UNSIGNED NOT NULL AUTO_INCREMENT`);
    }
}
