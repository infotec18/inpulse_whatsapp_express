import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1679946712157 implements MigrationInterface {
    name = 'InitialMigration1679946712157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`LOGIN_UNIQUE\` ON \`operadores\``);
        await queryRunner.query(`DROP INDEX \`CODIGO_ERP_UNIQUE\` ON \`operadores\``);
        await queryRunner.query(`DROP INDEX \`IDX_OPERADOR_CODIGO_ERP\` ON \`operadores\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`HORARIO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ALTERA_SENHA\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP INDEX \`IDX_02d67c2669eff6e71dd0d6a5ed\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`CODIGO_ERP\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`EDITA_CONTATOS\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`VISUALIZA_COMPRAS\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`CADASTRO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ULTIMO_LOGIN_INI\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ULTIMO_LOGIN_FIM\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`CODTELEFONIA\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`LOGADO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`AGENDA_LIG\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`LIGA_REPRESENTANTE\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`BANCO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`FILTRA_DDD\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`FILTRA_ESTADO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ASTERISK_RAMAL\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ASTERISK_USERID\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ASTERISK_LOGIN\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ASTERISK_SENHA\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`CODEC\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`ASSINATURA_EMAIL\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`LIGA_REPRESENTANTE_DIAS\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`EMAILOPERADOR\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`SENHAEMAILOPERADOR\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`EMAIL_EXIBICAO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`NOME_EXIBICAO\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`data_hora_ultima_mensagem_whats\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`ATIVO\` \`ATIVO\` enum ('SIM', 'NAO') NOT NULL DEFAULT 'SIM'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`NOME\` \`NOME\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`LOGIN\` \`LOGIN\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`EMAIL\` \`EMAIL\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD UNIQUE INDEX \`IDX_ba4494e51025baead7ebec53e8\` (\`EMAIL\`)`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`SENHA\` \`SENHA\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD UNIQUE INDEX \`IDX_f576fa95fde559450708c694c5\` (\`SENHA\`)`);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`EXPIRA_EM\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`EXPIRA_EM\` varchar(45) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD UNIQUE INDEX \`IDX_00cd38a283821ae2a378533a45\` (\`EXPIRA_EM\`)`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`NIVEL\` \`NIVEL\` enum ('ATIVO', 'RECEPTIVO', 'AMBOS', 'ADMIN') NOT NULL DEFAULT 'ATIVO'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`DATACAD\` \`DATACAD\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`DATACAD\` \`DATACAD\` datetime NULL DEFAULT '0000-00-00 00:00:00'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`NIVEL\` \`NIVEL\` enum ('ATIVO', 'RECEP', 'AMBOS', 'ADMIN') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP INDEX \`IDX_00cd38a283821ae2a378533a45\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP COLUMN \`EXPIRA_EM\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`EXPIRA_EM\` date NULL DEFAULT '0000-00-00'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP INDEX \`IDX_f576fa95fde559450708c694c5\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`SENHA\` \`SENHA\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` DROP INDEX \`IDX_ba4494e51025baead7ebec53e8\``);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`EMAIL\` \`EMAIL\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`LOGIN\` \`LOGIN\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`NOME\` \`NOME\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`ATIVO\` \`ATIVO\` enum ('SIM', 'NAO') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` CHANGE \`CODIGO\` \`CODIGO\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`data_hora_ultima_mensagem_whats\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`NOME_EXIBICAO\` varchar(60) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`EMAIL_EXIBICAO\` varchar(40) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`SENHAEMAILOPERADOR\` char(30) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`EMAILOPERADOR\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`LIGA_REPRESENTANTE_DIAS\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ASSINATURA_EMAIL\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`CODEC\` varchar(30) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ASTERISK_SENHA\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ASTERISK_LOGIN\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ASTERISK_USERID\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ASTERISK_RAMAL\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`FILTRA_ESTADO\` enum ('SIM', 'NAO') NULL DEFAULT 'NAO'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`FILTRA_DDD\` enum ('SIM', 'NAO') NULL DEFAULT 'NAO'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`BANCO\` varchar(255) NOT NULL DEFAULT 'crm_sgr'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`LIGA_REPRESENTANTE\` enum ('SIM', 'NAO') NULL DEFAULT 'NAO'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`AGENDA_LIG\` enum ('SIM', 'NAO') NULL DEFAULT 'NAO'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`LOGADO\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`CODTELEFONIA\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ULTIMO_LOGIN_FIM\` datetime NULL DEFAULT '0000-00-00 00:00:00'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ULTIMO_LOGIN_INI\` datetime NULL DEFAULT '0000-00-00 00:00:00'`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`CADASTRO\` enum ('TOTAL', 'NULOS') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`VISUALIZA_COMPRAS\` enum ('SIM', 'NAO') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`EDITA_CONTATOS\` enum ('SIM', 'NAO') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`CODIGO_ERP\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD UNIQUE INDEX \`IDX_02d67c2669eff6e71dd0d6a5ed\` (\`CODIGO_ERP\`)`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`ALTERA_SENHA\` enum ('SIM', 'NAO') NULL`);
        await queryRunner.query(`ALTER TABLE \`operadores\` ADD \`HORARIO\` int NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX \`IDX_OPERADOR_CODIGO_ERP\` ON \`operadores\` (\`CODIGO_ERP\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`CODIGO_ERP_UNIQUE\` ON \`operadores\` (\`CODIGO_ERP\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`LOGIN_UNIQUE\` ON \`operadores\` (\`LOGIN\`)`);
    }

}
