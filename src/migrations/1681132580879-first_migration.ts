import { MigrationInterface, QueryRunner } from "typeorm";

export class firstMigration1681132580879 implements MigrationInterface {
    name = 'firstMigration1681132580879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`atendimentos\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_OPERADOR\` int NULL, \`CODIGO_CLIENTE\` int NOT NULL, \`CODIGO_NUMERO\` int NOT NULL, \`CONCLUIDO\` tinyint NOT NULL, \`DATA_INICIO\` datetime NULL, \`DATA_FIM\` datetime NULL, \`DATA_AGENDAMENTO\` datetime NULL, \`URGENCIA\` enum ('URGENTE', 'ALTA', 'NORMAL') NOT NULL DEFAULT 'NORMAL', UNIQUE INDEX \`IDX_7f646676c743c35161772545a8\` (\`CODIGO_OPERADOR\`), UNIQUE INDEX \`IDX_2942751d1af49f32a6540b8aa7\` (\`CODIGO_CLIENTE\`), UNIQUE INDEX \`IDX_e96b07a3b03f5cdd5901595663\` (\`CODIGO_NUMERO\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_ATENDIMENTO\` int NOT NULL, \`TIPO\` varchar(30) NOT NULL, \`MENSAGEM\` text NULL, \`FROM_ME\` tinyint NOT NULL, \`DATA_HORA\` datetime NOT NULL, \`TIMESTAMP\` bigint NOT NULL, \`ID\` varchar(50) NOT NULL, \`ID_REFERENCIA\` varchar(255) NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens_arquivos\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_MENSAGEM\` int NOT NULL, \`TIPO\` text NOT NULL, \`ARQUIVO\` text NOT NULL, UNIQUE INDEX \`REL_48b1a90d0229f511c89ae23558\` (\`CODIGO_MENSAGEM\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clientes_numeros\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_CLIENTE\` int NOT NULL, \`NOME\` varchar(30) NOT NULL, \`NUMERO\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_68d2b0bd18f11ff5d41049e266\` (\`CODIGO_CLIENTE\`), UNIQUE INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\` (\`NUMERO\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens_prontas\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`APENAS_ADMIN\` tinyint NOT NULL, \`TEXTO_MENSAGEM\` text NOT NULL, \`ARQUIVO\` longblob NOT NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` ADD CONSTRAINT \`FK_abd3ff1160eb1148d7d39723239\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` ADD CONSTRAINT \`FK_bfc61a855f72382f855dab49f8b\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` ADD CONSTRAINT \`FK_48b1a90d0229f511c89ae235581\` FOREIGN KEY (\`CODIGO_MENSAGEM\`) REFERENCES \`mensagens\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` ADD CONSTRAINT \`FK_68d2b0bd18f11ff5d41049e2664\` FOREIGN KEY (\`CODIGO_CLIENTE\`) REFERENCES \`clientes\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clientes_numeros\` DROP FOREIGN KEY \`FK_68d2b0bd18f11ff5d41049e2664\``);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` DROP FOREIGN KEY \`FK_48b1a90d0229f511c89ae235581\``);
        await queryRunner.query(`ALTER TABLE \`mensagens\` DROP FOREIGN KEY \`FK_bfc61a855f72382f855dab49f8b\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` DROP FOREIGN KEY \`FK_abd3ff1160eb1148d7d39723239\``);
        await queryRunner.query(`DROP TABLE \`mensagens_prontas\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\` ON \`clientes_numeros\``);
        await queryRunner.query(`DROP INDEX \`IDX_68d2b0bd18f11ff5d41049e266\` ON \`clientes_numeros\``);
        await queryRunner.query(`DROP TABLE \`clientes_numeros\``);
        await queryRunner.query(`DROP INDEX \`REL_48b1a90d0229f511c89ae23558\` ON \`mensagens_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagens_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagens\``);
        await queryRunner.query(`DROP INDEX \`IDX_e96b07a3b03f5cdd5901595663\` ON \`atendimentos\``);
        await queryRunner.query(`DROP INDEX \`IDX_2942751d1af49f32a6540b8aa7\` ON \`atendimentos\``);
        await queryRunner.query(`DROP INDEX \`IDX_7f646676c743c35161772545a8\` ON \`atendimentos\``);
        await queryRunner.query(`DROP TABLE \`atendimentos\``);
    }

}
