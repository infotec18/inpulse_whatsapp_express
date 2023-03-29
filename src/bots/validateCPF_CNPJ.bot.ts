import services from "../services";

export async function validateCPF_CNPJBot(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
  
    const cpfRegex = /^(\d{3}\.){2}\d{3}-\d{2}$/;
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    const isCnpj: boolean = onlyNumbers.length === 14;
    const type: string = isCnpj ? "CNPJ" : "CPF";

    if(value.includes(".") && !cpfRegex.test(value) && !cnpjRegex.test(value)) {
        return { result: "wrong format", value:`CPF/CNPJ está em um formato inválido. 
Digite novamente:` };
    };

    if(onlyNumbers.length !== 11 && onlyNumbers.length !== 14) {
        return { result: "wrong format", value: `O CPF/CNPJ não tem uma quantidade valida de dígitos. 
Digite novamente:`};
    };

    const findRegister = await services.customers.findByCPFCNPJ(onlyNumbers);

    if(findRegister) {
        return { result: "already registered", value: findRegister };
    };

    return { result: "valid", value: type };
};