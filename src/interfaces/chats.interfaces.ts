export interface Mensagem {
    DATA: Date;
    CONTEUDO: "definir";
}

export interface Chat {
    CODIGO_OPERADOR: number;
    CLIENTE_NUMERO: string;
    MENSAGENS: Mensagem[];
};