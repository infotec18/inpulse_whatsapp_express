import { MigrationInterface, QueryRunner } from "typeorm";

export class Survey1683037040699 implements MigrationInterface {
    name = 'Survey1683037040699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`atendimentos_feedbacks\` (\`CODIGO\` int NOT NULL AUTO_INCREMENT, \`CODIGO_ATENDIMENTO\` int NOT NULL, \`NOTA_ATENDIMENTO\` int NOT NULL, \`COMENTARIO\` text NULL, PRIMARY KEY (\`CODIGO\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`atendimentos_feedbacks\``);
    }
}