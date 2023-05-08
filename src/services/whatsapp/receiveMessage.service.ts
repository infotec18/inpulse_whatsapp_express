import { Request } from "express";
import { runningAttendances, runningRegistrations, runningSurveys } from "../../WebSocket/WhatsappClient";
import services from "..";
import { OficialWhatsappMessage } from "../../interfaces/messages.interfaces";
import WebSocket from "../../WebSocket/WebSocket";
import { registrationBot } from "../../bots/registration.bot";
import { surveyBot } from "../../bots/surveyBot";
import { Sessions } from "../../WebSocket/Sessions";
import { RunningAttendance } from "../../interfaces/attendances.interfaces";

export async function receiveWhatsappMessageService (data: any) {
    if(!data.entry[0]?.changes[0]?.value?.messages[0]) return;
    const number = data.entry[0].changes[0].value.messages[0].from; 
    const message = data.entry[0].changes[0].value.messages[0] as OficialWhatsappMessage;
    console.log(message);
    const registrating = runningRegistrations.find({ WPP_NUMERO: number });
    const survey = runningSurveys.find(number);
    const attending = runningAttendances.find({ WPP_NUMERO: number });
    const textMsg = message.type === "text" ? message.text!.body : "";

    if (attending) {
        const newMessage = await services.messages.createOficial(message, attending.CODIGO_ATENDIMENTO, attending.CODIGO_OPERADOR, message.context?.id);
        newMessage && runningAttendances.update(attending.CODIGO_ATENDIMENTO, { MENSAGENS: [...attending.MENSAGENS, newMessage]});
        newMessage && WebSocket.to(`room_operator_${attending.CODIGO_OPERADOR}`).emit("new-message", newMessage);     
    } else if(registrating) {
        const { registration, reply } = await registrationBot(registrating, textMsg);
        reply && services.whatsapp.replyMessage(message, reply);
        runningRegistrations.update(number, registration);
    } else if(survey && message.type === "text") {
        const { registration, reply } = await surveyBot(survey, textMsg);
        reply && services.whatsapp.replyMessage(message, reply);
        runningSurveys.update(number, registration);
    } else {
        const findNumber = await services.wnumbers.find(number);

        if(findNumber) {
            const findCustomer = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance = await services.attendances.find(findNumber.CODIGO);

            if(findAttendance && findCustomer) {
                const operatorSession = await Sessions.getOperatorSession(findAttendance.CODIGO_OPERADOR) 
                const isOperatorOnline: boolean = operatorSession ? operatorSession.status === "online" : false;
                const newMessage = await services.messages.createOficial(message, findAttendance.CODIGO, findAttendance.CODIGO_OPERADOR, message.context?.id);

                if(newMessage) {
                    const newRA: RunningAttendance = {
                        CODIGO_ATENDIMENTO: findAttendance.CODIGO,
                        CODIGO_CLIENTE: findAttendance.CODIGO_CLIENTE,
                        CODIGO_OPERADOR: findAttendance.CODIGO_OPERADOR,
                        CODIGO_NUMERO: findNumber.CODIGO,
                        WPP_NUMERO: number,
                        MENSAGENS: [newMessage],
                        AVATAR: "",
                        DATA_INICIO: findAttendance.DATA_INICIO,
                        URGENCIA: findAttendance.URGENCIA,
                        CPF_CNPJ: findCustomer.CPF_CNPJ,
                        NOME: findNumber.NOME,
                        RAZAO: findCustomer.RAZAO
                    };
    
                    runningAttendances.create(newRA);
                    isOperatorOnline && runningAttendances.returnOperatorAttendances(findAttendance.CODIGO_OPERADOR);
                };
            } else if(findCustomer) {
                const avaliableOperator = await services.attendances.getOperator(findCustomer.OPERADOR);
                const attendingOperator = avaliableOperator && await services.users.getOneById(avaliableOperator);

                    if(avaliableOperator && attendingOperator) {
                        console.log(new Date().toLocaleString(), ": Novo atendimento para operador de ID", avaliableOperator, " | cliente de ID ", findCustomer.CODIGO);
                        const newAttendance = await services.attendances.create({
                            CODIGO_OPERADOR: avaliableOperator,
                            CODIGO_CLIENTE: findNumber.CODIGO_CLIENTE,
                            CODIGO_NUMERO: findNumber.CODIGO,
                            CONCUIDO: null,
                            DATA_INICIO: new Date(),
                            DATA_FIM: null
                        }); 

                        const newMessage = await services.messages.createOficial(message, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, message.context?.id);
    
                        
                        const reply = `Seu atendimento foi iniciado, você está sendo atendido por ${attendingOperator.NOME}.`
                        newMessage && services.whatsapp.replyMessage(message, reply); 
            
                        const replyFormated: OficialWhatsappMessage = {
                            from: "me",
                            id: "",
                            timestamp: `${Date.now()}`,
                            type: "text",
                            text: {
                                body: reply
                            }
                        };

                        const savedReply = await services.messages.createOficial(replyFormated, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, message.id, true, true);
                        
                        newMessage && savedReply && runningAttendances.create({
                            CODIGO_ATENDIMENTO: newAttendance.CODIGO,
                            CODIGO_CLIENTE: newAttendance.CODIGO_CLIENTE,
                            CODIGO_OPERADOR: newAttendance.CODIGO_OPERADOR,
                            CODIGO_NUMERO: newAttendance.CODIGO_NUMERO,
                            URGENCIA: newAttendance.URGENCIA,
                            WPP_NUMERO: number,
                            MENSAGENS: [newMessage, savedReply],
                            AVATAR: "",
                            DATA_INICIO: newAttendance.DATA_INICIO,
                            CPF_CNPJ: findCustomer.CPF_CNPJ,
                            NOME: findNumber.NOME,
                            RAZAO: findCustomer.RAZAO
                        }); 

                        newMessage && runningAttendances.returnOperatorAttendances(avaliableOperator); 

                    } else {
                        console.log(new Date().toLocaleString(), `: Sem operador online para atender: Cliente de ID ${findNumber.CODIGO_CLIENTE} | WPP: ${number}`);
                        console.log(new Date().toLocaleString(), ": Mensagem: ", message.type, " - ",textMsg);
                    };
            };  
            
        } else {
            const msgTimestamp = Number(`${message.timestamp}000`);
            const isMessageFromNow = (msgTimestamp + 60000) >= Date.now();

            if(isMessageFromNow) {
                const newRegistration = { WPP_NUMERO: number, ETAPA: 1, ETAPA_COUNT: 0, DADOS: {}, CONCLUIDO: false};
                runningRegistrations.create(newRegistration);
                const { registration, reply } = await registrationBot(newRegistration, textMsg);
                reply && services.whatsapp.replyMessage(message, reply);
                runningRegistrations.update(number, registration);
            };
        };
    };
};