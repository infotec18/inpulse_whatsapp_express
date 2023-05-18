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
import { Fidelizacao } from "../../entities/fidelizacao.entity";

export async function finishAttendanceService(COD_ATENDIMENTO: number, COD_RESULTADO: number, DATA_AGENDAMENTO?: Date): Promise<RunningSurvey | void> {
    const TABELA_ATENDIMENTOS: Repository<Attendance> = AppDataSource.getRepository(Attendance);
    const TABELA_CC: Repository<ClientCampaign> = AppDataSource.getRepository(ClientCampaign);
    const TABELA_RESULTADOS: Repository<Result> = AppDataSource.getRepository(Result);
    const TABELA_HISTORICO: Repository<HistoricoCli> = AppDataSource.getRepository(HistoricoCli);
    const TABELA_CAMPANHAS: Repository<Campanha> = AppDataSource.getRepository(Campanha);
    const TABELA_OPERADORES: Repository<User> = AppDataSource.getRepository(User);
    const TABELA_FIDELIZACOES: Repository<Fidelizacao> = AppDataSource.getRepository(Fidelizacao);

    const ATENDIMENTO: Attendance | null = await TABELA_ATENDIMENTOS.findOneBy({ CODIGO: COD_ATENDIMENTO });
    const RESULTADO: Result | null = await TABELA_RESULTADOS.findOneBy({ CODIGO: COD_RESULTADO });
    const CC = !!ATENDIMENTO && !!ATENDIMENTO.CODIGO_CC && await TABELA_CC.findOneBy({ CODIGO: ATENDIMENTO.CODIGO_CC });
    const CAMPANHA = !!CC && await TABELA_CAMPANHAS.findOneBy({ CODIGO: CC.CAMPANHA });

    if (ATENDIMENTO && RESULTADO && CC) {
        const CONTATO: Wnumber | null = await services.wnumbers.getById(ATENDIMENTO?.CODIGO_NUMERO);
        const OPERADOR: User | null = await TABELA_OPERADORES.findOneBy({ CODIGO: ATENDIMENTO.CODIGO_OPERADOR });
        const DEVE_FIDELIZAR = RESULTADO.FIDELIZARCOTACAO === "SIM" && ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR === 0;

        // Define atendimento do Whatsapp como concluído e insere data fim;
        ATENDIMENTO.CONCLUIDO = 1;
        ATENDIMENTO.DATA_FIM = new Date();
        await TABELA_ATENDIMENTOS.save(ATENDIMENTO);

        // Define data de agendamento do atendimento;
        let DATA_AGENDAMENTO_CC;   

        const AGENDAMENTO_AUTOMATICO = {
            "AUTOMATICO 1 ANO": () => {
                const today = new Date();
                today.setFullYear(today.getFullYear() + 1)
                return today;
            },
            "AUTOMATICO 6 MESES": () => {
                const today = new Date();
                today.setMonth(today.getMonth() + 6);
                return today;
            }, 
            "AUTOMATICO 3 MESES": () => {
                const today = new Date();
                today.setMonth(today.getMonth() + 3);
                return today;
            }, 
            "AUTOMATICO 2 MESES": () => {
                const today = new Date();
                today.setMonth(today.getMonth() + 2);
                return today;
            }, 
            "AUTOMATICO 1 MÊS": () => {
                const today = new Date();
                today.setMonth(today.getMonth() + 1);
                return today;
            }, 
            "AUTOMATICO 15 DIAS": () => {
                const today = new Date();
                today.setDate(today.getDate() + 15);
                return today;
            }, 
            "AUTOMATICO 7 DIAS": () => {
                const today = new Date();
                today.setDate(today.getDate() + 7);
                return today;
            },
            "AUTOMATICO 2 DIAS": () => {
                const today = new Date();
                today.setDate(today.getDate() + 2);
                return today;
            },
            "AUTOMATICO 1 DIA": () => {
                const today = new Date();
                today.setDate(today.getDate() + 1);
                return today;
            }, 
            "AUTOMATICO 1 HORA": () => {
                const today = new Date();
                today.setHours(today.getHours() + 1);
                return today;
            }, 
            "AUTOMATICO 20 MINUTOS": () => {
                const today = new Date();
                today.setMinutes(today.getMinutes() + 20);
                return today
            }
        };

        const ACOES_AUTOMATICO = Object.keys(AGENDAMENTO_AUTOMATICO);

        if(RESULTADO.NOME_ACAO === "INFORMA DATA E HORA" && !!DATA_AGENDAMENTO) {
            console.log("DATA INFORMADA: ", DATA_AGENDAMENTO)
            DATA_AGENDAMENTO_CC = DATA_AGENDAMENTO
        } else if(ACOES_AUTOMATICO.some(v => v === RESULTADO.NOME_ACAO)) {
            DATA_AGENDAMENTO_CC = AGENDAMENTO_AUTOMATICO[RESULTADO.NOME_ACAO as keyof typeof AGENDAMENTO_AUTOMATICO]();
            console.log("DATA ACAO: ", DATA_AGENDAMENTO_CC)
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            DATA_AGENDAMENTO_CC = tomorrow;
            console.log("DATA AMANHA: ", tomorrow);
        };

        // Altera registro CC
        CC.DATA_HORA_LIG = new Date(Date.now() - 3600);
        CC.DATA_HORA_FIM = new Date();
        CC.DT_RESULTADO = new Date();
        CC.RESULTADO = RESULTADO.CODIGO;
        CC.FIDELIZA = DEVE_FIDELIZAR ? 'S' : 'N';
        await TABELA_CC.save(CC);

        // Cria novo registro CC
        const NOVO_CC = await TABELA_CC.save({
            CAMPANHA: CC.CAMPANHA,
            CLIENTE: CC.CLIENTE,
            CONCLUIDO: "NAO",
            DT_AGENDAMENTO: DATA_AGENDAMENTO_CC,
            OPERADOR: DEVE_FIDELIZAR ? ATENDIMENTO.CODIGO_OPERADOR : ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR,
            FONE1: CC.FONE1,
            FONE2: CC.FONE2,
            FONE3: CC.FONE3
        });

        // Cria novo agendamento no Whatsapp
        NOVO_CC && await TABELA_ATENDIMENTOS.save({
            ATIVO_RECEP: "ATIVO",
            CODIGO_CLIENTE: ATENDIMENTO.CODIGO_CLIENTE,
            CODIGO_NUMERO: ATENDIMENTO.CODIGO_NUMERO,
            CODIGO_OPERADOR: ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR === 0 ? ATENDIMENTO.CODIGO_OPERADOR : ATENDIMENTO.CODIGO_OPERADOR_ANTERIOR,
            CODIGO_OPERADOR_ANTERIOR: 0 /* DUVIDA */,
            DATA_AGENDAMENTO: DATA_AGENDAMENTO_CC,
            URGENCIA_AGENDAMENTO: RESULTADO.WHATS_URGENCIA_AGENDAMENTO,
            DATA_INICIO: DATA_AGENDAMENTO_CC,
            CONCLUIDO: 0,
            CODIGO_CC: NOVO_CC.CODIGO
        });

        // Insere registro em tabela histórico
        const hist = CONTATO && OPERADOR && CAMPANHA && ATENDIMENTO.CODIGO_CC && await TABELA_HISTORICO.save({
            CAMPANHA: CAMPANHA.NOME,
            ATIVO_RECEP: ATENDIMENTO.ATIVO_RECEP,
            CC_CODIGO: ATENDIMENTO.CODIGO_CC,
            CLIENTE: ATENDIMENTO.CODIGO_CLIENTE,
            OBSERVACAO: `Whats ${CONTATO?.NUMERO}`,
            DATAHORA_INICIO: CC.DATA_HORA_LIG || new Date(Date.now()),
            DATAHORA_FIM: CC.DATA_HORA_FIM || new Date(Date.now() - 5000),
            OPERADOR: OPERADOR.NOME,
            RESULTADO: RESULTADO.CODIGO,
            TELEFONE: CONTATO.NUMERO,
        });

        // Insere registro em fidelizações, caso deva fidelizar;
        if(DEVE_FIDELIZAR) {
            const fid = await TABELA_FIDELIZACOES.save({
                cc_codigo: CC.CODIGO,
                cliente: CC.CLIENTE,
                dt_criacao: CC.DATA_HORA_FIM,
                operador_criacao: CC.OPERADOR_LIGACAO,
                qtde_fidelizar: RESULTADO.QTDE_FIDELIZARCOTACAO,
                cod_origem: 0
            });

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