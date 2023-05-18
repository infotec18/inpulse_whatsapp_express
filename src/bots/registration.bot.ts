import { AppDataSource } from "../data-source";
import { Customer } from "../entities/customer";
import { BotReply, RunningRegistration } from "../interfaces/attendances.interfaces";
import services from "../services";
import { validateCPF_CNPJBot } from "./validateCPF_CNPJ.bot";

export async function registrationBot(RR: RunningRegistration, msg: string): Promise<BotReply<RunningRegistration>> {
    let reply: string | null = null;

    console.log(new Date().toLocaleString(), ": Mensagem de ", RR.WPP_NUMERO, "caiu para o bot...");

    if(msg.toLowerCase() === "reiniciar") {
        RR.ETAPA = 2;
        RR.DADOS = { };
        return await registrationBot(RR, "CADASTRAR");
    };

    if(RR.ETAPA === 1 && RR.ETAPA_COUNT === 0) {
        RR.ETAPA++;
        RR.ETAPA_COUNT = RR.ETAPA_COUNT + 1;
        reply = `Olá, não encontramos seu número no nosso sistema... 
Deseja cadastrar este número?
Responda "cadastrar" para prosseguir. 
        `;
        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 2  && msg.toUpperCase() === "CADASTRAR") {
        reply = "Ok, por favor digite seu CPF ou CNPJ para continuarmos: ";
        RR.ETAPA++;
        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);
        return { registration: RR, reply };
    };

    const validate = await validateCPF_CNPJBot(msg);

    if(RR.ETAPA === 3 && validate.result === "already registered" && validate.value instanceof Customer ) {
        RR.ETAPA += 3;
        RR.CADASTRO_CLIENTE = validate.value;

        reply = "Estamos quase lá, por favor diga o nome do responsável que atende este número: ";

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        return { registration: RR, reply };

    } else if(RR.ETAPA === 3 && validate.result === "valid") {
        const substr = "a RAZÃO SOCIAL da sua empresa";

        reply = `Seu ${validate.value} é válido. para prosseguir com o cadastro, digite ${substr}:`;
        RR.DADOS.CPF_CNPJ = msg.replace(/\D/g, "");
        RR.DADOS.PESSOA = validate.value === "CNPJ" ? "JUR" : "FIS";
        RR.ETAPA ++;
        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        return { registration: RR, reply };
    }else if(RR.ETAPA === 3) {

        reply = validate.value as string;

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        return { registration: RR, reply };
    };

    if(RR.ETAPA === 4) {
        console.log("etapa 4")
        RR.DADOS.RAZAO = msg;

        const substr = "RAZÃO SOCIAl";

        reply = `Verifique se os dados estão corretos:
- CPF/CNPJ: ${RR.DADOS.CPF_CNPJ}
- ${substr}: ${RR.DADOS.RAZAO}
- PESSOA: ${RR.DADOS.PESSOA === "FIS" ? "física" : "jurídica"}

Digite "sim" para continuar ou "reiniciar" para recomeçar.
        `;

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        RR.ETAPA++;


        return { registration: RR, reply };
    };

    if(RR.ETAPA === 5 && msg.toUpperCase() == "SIM") {
        const newCustomer = await services.customers.directCreate(RR.DADOS, RR.WPP_NUMERO);

        RR.CADASTRO_CLIENTE = newCustomer;
        RR.ETAPA++;

        reply = "Estamos quase lá, por favor diga o nome do responsável que atende este número: ";

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        return { registration: RR, reply };
        
    } else if(RR.ETAPA === 5) {

        reply = `Não entendi, por favor digite "sim" ou "reiniciar"`;

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 6) {
        if(RR.CADASTRO_CLIENTE) {
            const newNumber = { CODIGO_CLIENTE: RR.CADASTRO_CLIENTE!.CODIGO, NOME: msg, NUMERO: RR.WPP_NUMERO };
            await services.wnumbers.create(newNumber);
            const customersRepository = AppDataSource.getRepository(Customer);
            if(newNumber) {
                reply = "Que legal, você foi cadastrado com sucesso! Envie qualquer mensagem, se quiser começar um novo atendimento.";
            };

            const NUMERO = newNumber.NUMERO;
            const NUMERO_WITHOUT_MINUS = NUMERO.replace("+", "");
            const AREA1 = NUMERO_WITHOUT_MINUS.slice(2, 4);
            const FONE1 = NUMERO_WITHOUT_MINUS.slice(4);

            RR.CADASTRO_CLIENTE.AREA1 = Number(AREA1);
            RR.CADASTRO_CLIENTE.FONE1 = FONE1;
            customersRepository.save(RR.CADASTRO_CLIENTE);
        };

        RR.CONCLUIDO = true;

        console.log(new Date().toLocaleString(), ": Bot respondeu: ", reply);

        return { registration: RR, reply };
    };

    return { registration: RR, reply };
};