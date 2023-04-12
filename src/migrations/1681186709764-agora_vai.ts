import { MigrationInterface, QueryRunner } from "typeorm";

export class agoraVai1681186709764 implements MigrationInterface {
    name = 'agoraVai1681186709764'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`CREATE TABLE \`avatares\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_OPERADOR\` int NOT NULL, \`ARQUIVO\` text NULL, UNIQUE INDEX \`IDX_e98f3242b9d274eb97d145b73d\` (\`CODIGO_OPERADOR\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`atendimentos_historico\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_ATENDIMENTO\` int NOT NULL, \`MENSAGEM\` text NOT NULL, \`DATA_HORA\` datetime NOT NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`atendimentos\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_OPERADOR\` int NULL DEFAULT '0', \`CODIGO_CLIENTE\` int NOT NULL, \`CODIGO_NUMERO\` int NOT NULL, \`CONCLUIDO\` tinyint NULL DEFAULT '0', \`DATA_INICIO\` datetime NULL, \`DATA_FIM\` datetime NULL, \`DATA_AGENDAMENTO\` datetime NULL, \`URGENCIA\` enum ('URGENTE', 'ALTA', 'NORMAL') NOT NULL DEFAULT 'NORMAL', PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_ATENDIMENTO\` int NOT NULL, \`TIPO\` varchar(30) NOT NULL, \`MENSAGEM\` text NULL, \`FROM_ME\` tinyint NOT NULL, \`DATA_HORA\` datetime NOT NULL, \`TIMESTAMP\` bigint NOT NULL, \`ID\` varchar(255) NOT NULL, \`ID_REFERENCIA\` varchar(255) NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens_arquivos\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_MENSAGEM\` int NOT NULL, \`TIPO\` text NOT NULL, \`ARQUIVO\` text NOT NULL, UNIQUE INDEX \`REL_48b1a90d0229f511c89ae23558\` (\`CODIGO_MENSAGEM\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagens_prontas\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`APENAS_ADMIN\` tinyint NOT NULL, \`TEXTO_MENSAGEM\` text NOT NULL, \`TITULO\` text NOT NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`mensagensprontas_arquivos\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_MENSAGEM\` int NOT NULL, \`TIPO\` varchar(30) NOT NULL, \`ARQUIVO\` text NOT NULL, UNIQUE INDEX \`REL_a6f425743dacb3a7a7f0780985\` (\`CODIGO_MENSAGEM\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clientes_numeros\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_CLIENTE\` int NOT NULL, \`NOME\` varchar(30) NOT NULL, \`NUMERO\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_68d2b0bd18f11ff5d41049e266\` (\`CODIGO_CLIENTE\`), UNIQUE INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\` (\`NUMERO\`), PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` ADD CONSTRAINT \`FK_abd3ff1160eb1148d7d39723239\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagens\` ADD CONSTRAINT \`FK_bfc61a855f72382f855dab49f8b\` FOREIGN KEY (\`CODIGO_ATENDIMENTO\`) REFERENCES \`atendimentos\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` ADD CONSTRAINT \`FK_48b1a90d0229f511c89ae235581\` FOREIGN KEY (\`CODIGO_MENSAGEM\`) REFERENCES \`mensagens\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mensagensprontas_arquivos\` ADD CONSTRAINT \`FK_a6f425743dacb3a7a7f07809850\` FOREIGN KEY (\`CODIGO_MENSAGEM\`) REFERENCES \`mensagens_prontas\`(\`CODIGO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mensagensprontas_arquivos\` DROP FOREIGN KEY \`FK_a6f425743dacb3a7a7f07809850\``);
        await queryRunner.query(`ALTER TABLE \`mensagens_arquivos\` DROP FOREIGN KEY \`FK_48b1a90d0229f511c89ae235581\``);
        await queryRunner.query(`ALTER TABLE \`mensagens\` DROP FOREIGN KEY \`FK_bfc61a855f72382f855dab49f8b\``);
        await queryRunner.query(`ALTER TABLE \`atendimentos_historico\` DROP FOREIGN KEY \`FK_abd3ff1160eb1148d7d39723239\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e24a7cb9bed4ed6f96fa22978\` ON \`clientes_numeros\``);
        await queryRunner.query(`DROP INDEX \`IDX_68d2b0bd18f11ff5d41049e266\` ON \`clientes_numeros\``);
        await queryRunner.query(`DROP TABLE \`clientes_numeros\``);
        await queryRunner.query(`DROP INDEX \`REL_a6f425743dacb3a7a7f0780985\` ON \`mensagensprontas_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagensprontas_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagens_prontas\``);
        await queryRunner.query(`DROP INDEX \`REL_48b1a90d0229f511c89ae23558\` ON \`mensagens_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagens_arquivos\``);
        await queryRunner.query(`DROP TABLE \`mensagens\``);
        await queryRunner.query(`DROP TABLE \`atendimentos\``);
        await queryRunner.query(`DROP TABLE \`atendimentos_historico\``);
        await queryRunner.query(`DROP INDEX \`IDX_e98f3242b9d274eb97d145b73d\` ON \`avatares\``);
        await queryRunner.query(`DROP TABLE \`avatares\``);
    }
}
