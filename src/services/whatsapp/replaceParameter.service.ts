import { AppDataSource } from "../../data-source";
import { Customer } from "../../entities/customer";
import { User } from "../../entities/user.entity";
import { Wnumber } from "../../entities/wnumber.entity";

interface Props {
    str: string;
    contact: Wnumber;
    operator?: User;
};

export async function replaceParameterService({ str, contact, operator }: Props) {
    const clientsRepository = AppDataSource.getRepository(Customer);
    const client = await clientsRepository.findOneBy({ CODIGO: contact.CODIGO_CLIENTE });

    if (str === "nome_do_cliente") {
        return contact.NOME
    } else if (str === "empresa_do_cliente") {
        return client?.RAZAO || "EMPRESA_NÃO_ENCONTRADA";
    } else if (str === "nome_do_operador") {
        return operator?.NOME || "operador"
    } else if (str === "cumprimento") {
        const currentTime = new Date().getHours();

        const isMorning = currentTime >= 5 && currentTime < 12;
        const isEvening = currentTime >= 12 && currentTime < 18;

        return isMorning ? "Bom dia" : isEvening ? "Boa tarde" : "Boa noite";
    } else {
        return "{{?}}";
    };
};