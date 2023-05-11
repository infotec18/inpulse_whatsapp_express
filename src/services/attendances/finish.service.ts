import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Attendance } from "../../entities/attendance.entity";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import { ClientCampaign } from "../../entities/clientCampaign.entity";
import { RunningSurvey } from "../../interfaces/attendances.interfaces";
import { Result } from "../../entities/result.entity";
import services from "..";
import { Wnumber } from "../../entities/wnumber.entity";
import { HistoricoCli } from "../../entities/historicoCli.entity";
import { Campanha } from "../../entities/campanha.entity";
import { User } from "../../entities/user.entity";

export async function finishAttendanceService(COD_ATENDIMENTO: number, COD_RESULTADO: number, DATA_AGENDAMENTO?: Date): Promise<RunningSurvey | void> {

    const TABELA_ATENDIMENTOS: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const TABELA_CC: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const TABELA_RESULTADOS: Repository<Result> = AppDataSource.getRepository(Result);
    const TABELA_HISTORICO: Repository<HistoricoCli> = AppDataSource.getRepository(HistoricoCli);
    const TABELA_CAMPANHAS: Repository<Campanha> = AppDataSource.getRepository(Campanha);
    const TABELA_OPERADORES: Repository<User> = AppDataSource.getRepository(User);

    const ATENDIMENTO: Attendance | null = await TABELA_ATENDIMENTOS.findOneBy({ CODIGO: COD_ATENDIMENTO });
    const RESULTADO: Result | null = await TABELA_RESULTADOS.findOneBy({ CODIGO: COD_RESULTADO });

    if (ATENDIMENTO && RESULTADO) {
        console.log("FOI AQUI", RESULTADO.NOME);
        console.log("DATA", DATA_AGENDAMENTO)

        const CONTATO: Wnumber | null = await services.wnumbers.getById(ATENDIMENTO?.CODIGO_NUMERO);
        const OPERADOR: User | null = await TABELA_OPERADORES.findOneBy({ CODIGO: ATENDIMENTO.CODIGO_OPERADOR });
        const DEVE_FIDELIZAR = RESULTADO.FIDELIZARCOTACAO === "SIM" && ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR <= 0 && !!DATA_AGENDAMENTO;

        if(RESULTADO.WHATS_ACAO === "AGENDAR" && !!DATA_AGENDAMENTO) {

            services.attendances.create({
                CODIGO_CLIENTE: ATENDIMENTO.CODIGO_CLIENTE,
                CODIGO_NUMERO: ATENDIMENTO.CODIGO_NUMERO,
                CODIGO_OPERADOR: DEVE_FIDELIZAR ? ATENDIMENTO.CODIGO_OPERADOR : ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR,
                CODIGO_OPERADOR_ANTERIOR: ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR,
                CONCLUIDO: 1,
                DATA_AGENDAMENTO: DATA_AGENDAMENTO,
                DATA_INICIO: DATA_AGENDAMENTO,
                DATA_FIM: null,
                URGENCIA_AGENDAMENTO: RESULTADO.WHATS_URGENCIA_AGENDAMENTO,
                URGENCIA_SUPERVISOR: null,
                URGENCIA_OPERADOR: "ALTA",
                ATIVO_RECEP: "ATIVO",
            });
        };

        if (CONTATO && OPERADOR) {
            const CC: ClientCampaign | null = await TABELA_CC.findOneBy({
                CLIENTE: ATENDIMENTO.CODIGO_CLIENTE,
                CONCLUIDO: 'NAO',
                OPERADOR: ATENDIMENTO.CODIGO_OPERADOR
            });

            const CAMPANHA: Campanha | null = CC && await TABELA_CAMPANHAS.findOneBy({ CODIGO: CC.CAMPANHA })

            if (CC && CAMPANHA) {
                TABELA_ATENDIMENTOS.save({
                    CODIGO: COD_ATENDIMENTO,
                    CONCLUIDO: 1,
                    DATA_FIM: new Date(),
                });

                TABELA_CC.save({
                    CODIGO: CC.CODIGO,
                    CONCLUIDO: DEVE_FIDELIZAR ? "SIM" : "NAO",
                    DT_AGENDAMENTO: DEVE_FIDELIZAR ? new Date() : CC.DT_AGENDAMENTO,
                    DT_RESULTADO: DEVE_FIDELIZAR ? new Date() : CC.DT_RESULTADO,
                    DATA_HORA_LIG: DEVE_FIDELIZAR ? new Date(Date.now() - 3600) : CC.DATA_HORA_LIG,
                    DATA_HORA_FIM: DEVE_FIDELIZAR ? new Date() : CC.DATA_HORA_FIM,
                    RESULTADO: DEVE_FIDELIZAR ? COD_RESULTADO : CC.RESULTADO,
                    OPERADOR: DEVE_FIDELIZAR ? ATENDIMENTO.CODIGO_OPERADOR : ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR,
                    OPERADOR_LIGACAO: DEVE_FIDELIZAR ? ATENDIMENTO.CODIGO_OPERADOR : 0,
                    TELEFONE_LIGADO: DEVE_FIDELIZAR ? CONTATO.NUMERO : CC.TELEFONE_LIGADO
                });

                if (DEVE_FIDELIZAR) {
                    TABELA_CC.save({
                        CONCLUIDO: "NAO",
                        DT_AGENDAMENTO: DATA_AGENDAMENTO,
                        CAMPANHA: CC.CAMPANHA,
                        CLIENTE: CC.CLIENTE,
                        FONE1: CC.FONE1,
                        OPERADOR: ATENDIMENTO.CODIGO_OPERADOR,
                        OPERADOR_LIGACAO: 0,
                        FIDELIZA: 'S'
                    });

                    TABELA_HISTORICO.save({
                        CAMPANHA: CAMPANHA.NOME,
                        ATIVO_RECEP: ATENDIMENTO.ATIVO_RECEP,
                        OPERADOR: OPERADOR.LOGIN,
                        DATAHORA_INICIO: CC.DATA_HORA_LIG!,
                        DATA_HORA_FIM: CC.DATA_HORA_FIM!,
                        RESULTADO: CC.RESULTADO,
                        TELEFONE: CONTATO.NUMERO,
                        OBSERVACAO: `WPP COD_ATENDIMENTO: ${ATENDIMENTO.CODIGO}`,
                        CLIENTE: CC.CLIENTE,
                        CC_CODIGO: CC.CODIGO
                    });
                };
            };

            
        };
    };


    //const ra = runningAttendances.find({ CODIGO_ATENDIMENTO: COD_ATENDIMENTO });
    runningAttendances.remove(COD_ATENDIMENTO);

    /* if(ra) {
        const newRs = {
            WPP_NUMERO: ra.WPP_NUMERO,
            COD_ATENDIMENTO: ra.CODIGO_ATENDIMENTO,
            CONCLUIDO: false,
            ETAPA: 1,
            ETAPA_COUNT: 0
        };
        ra && runningSurveys.create(newRs);
        return newRs;
    }; */
};