import { Customer } from "../entities/customer";
import { RegistrationReply, RunningRegistration } from "../interfaces/attendances.interfaces";
import services from "../services";
import { validateCPF_CNPJBot } from "./validateCPF_CNPJ.bot";

export async function registrationBot(RR: RunningRegistration, msg: string): Promise<RegistrationReply> {
    let reply: string | null = null;

    if(msg === "voltar etapa") {
        RR.ETAPA--;
        return { registration: RR, reply: `Voltando a etapa ${RR.ETAPA}` };
    };

    if(msg === "reiniciar") {
        RR.ETAPA = 2;
        RR.DADOS = { };
        return await registrationBot(RR, "cadastrar");
    };

    if(RR.ETAPA === 1) {
        RR.ETAPA++;
        reply = `Olá, não encontramos seu número no nosso sistema... 
Deseja cadastrar este número?
Responda "cadastrar" para prosseguir. 
        `;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 2  && msg.toUpperCase() === "CADASTRAR") {
        reply = "Ok, por favor digite seu CPF ou CNPJ para continuarmos: ";
        RR.ETAPA++;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 2) {
        reply =  `Digite "cadastrar" para prosseguir seu atendimento...`
        return { registration: RR, reply };
    };

    const validate = await validateCPF_CNPJBot(msg);

    if(RR.ETAPA === 3 && validate.result === "already registered" && validate.value instanceof Customer ) {
        RR.ETAPA += 2;
        const CODIGO_CLIENTE = validate.value.CODIGO;
        await services.wnumbers.create({ CODIGO_CLIENTE, NOME: "TESTE", NUMERO: RR.WPP_NUMERO});
        reply = `Seu número foi cadastrado com sucesso. ${validate.value.RAZAO}`;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 3 && validate.result === "valid") {
        reply = `Seu ${validate.value} é válido. para prosseguir com o cadastro, digite sua RAZÃO SOCIAL:`;
        RR.DADOS.CPF_CNPJ = msg.replace(/\D/g, "");
        RR.DADOS.PESSOA = validate.value === "CNPJ" ? "JUR" : "FIS";
        RR.ETAPA ++;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 3) {
        reply = validate.value as string;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 4 && !RR.DADOS.RAZAO) {
        RR.DADOS.RAZAO = msg;
        reply = `Ok, agora por favor, digite seu nome FANTASIA: `
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 4 && !RR.DADOS.FANTASIA) {
        RR.DADOS.FANTASIA = msg;
        reply = `Verifique se os dados estão corretos:
- CPF/CNPJ: ${RR.DADOS.CPF_CNPJ}
- RAZÃO SOCIAL: ${RR.DADOS.RAZAO}
- FANTASIA: ${RR.DADOS.FANTASIA}
- PESSOA: ${RR.DADOS.PESSOA === "FIS" ? "física" : "jurídica"}

Digite "sim" para continuar ou "reiniciar" para recomeçar.
        `;
        RR.ETAPA++;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 5 && msg === "sim" && RR.DADOS.PESSOA === "FIS") {
        const newCustomer = await services.customers.directCreate(RR.DADOS);
        const newNumber = { CODIGO_CLIENTE: newCustomer.CODIGO, NOME: RR.DADOS.RAZAO!, NUMERO: RR.WPP_NUMERO };
        await services.wnumbers.create(newNumber);

        RR.CONCLUIDO = true;
        reply = "Que legal, você foi cadastrado com sucesso! Envie qualquer mensagem, se quiser começar um novo atendimento.";

        return { registration: RR, reply };
    };

    if(RR.ETAPA === 5 && msg === "sim" && RR.DADOS.PESSOA === "JUR") {
        const newCustomer = await services.customers.directCreate(RR.DADOS);

        RR.CADASTRO_CLIENTE = newCustomer;
        RR.ETAPA++;

        reply = "Estamos quase lá, por favor diga o nome do responsável que atende este número: ";

        return { registration: RR, reply };
    };

    if(RR.ETAPA === 5) {
        reply = `Não entendi, por favor digite "sim" ou "reiniciar"`;
        return { registration: RR, reply };
    };

    if(RR.ETAPA === 6) {
        const newNumber = { CODIGO_CLIENTE: RR.CADASTRO_CLIENTE!.CODIGO, NOME: msg, NUMERO: RR.WPP_NUMERO };
        await services.wnumbers.create(newNumber);
        RR.CONCLUIDO = true;
        reply = "Que legal, você foi cadastrado com sucesso! Envie qualquer mensagem, se quiser começar um novo atendimento.";

        return { registration: RR, reply };
    };

    return { registration: RR, reply };
};