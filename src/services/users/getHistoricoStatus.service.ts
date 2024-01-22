import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { OperadorStatusLog } from '../../entities/operadoresStatusLog.entity';


export async function getHistoricoStatusService(startDate: Date, endDate: Date, codigo_operador: number) {
    const historicoRepository = AppDataSource.getRepository(OperadorStatusLog);

    const startDF = converterDataParaDiaMesAno(startDate);
    const endDF = converterDataParaDiaMesAno(endDate);

    const HISTORICO_STATUS = await getHistoricoStatus(codigo_operador, startDF, endDF, historicoRepository);


    return { dados: HISTORICO_STATUS};
}

export async function getHistoricoStatus(codigo_operador: number, startDF: string, endDF: string, historicoRepository: Repository<OperadorStatusLog>) {
    return await historicoRepository.query(
        "SELECT * FROM operadores_status_log WHERE OPERADOR = ? AND DATA BETWEEN ? AND ?",
        [codigo_operador, startDF, endDF]
    );
}
export function converterDataParaDiaMesAno(dataComHoras:any) {
    const data = new Date(dataComHoras);
    const dia = data.getDate();
    const mes = data.getMonth() + 1; 
    const ano = data.getFullYear();
  
    const dataFormatada = `${ano}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
  
    return dataFormatada;
  }
  