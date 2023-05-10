import { runningAttendances, runningRegistrations, runningSurveys } from "../../WebSocket/WhatsappClient";
import services from "..";
import { OficialWhatsappMessage } from "../../interfaces/messages.interfaces";
import { registrationBot } from "../../bots/registration.bot";
import { surveyBot } from "../../bots/surveyBot";
import { Sessions } from "../../WebSocket/Sessions";

export async function receiveWhatsappMessageService(data: any) {
    if (!data.entry[0]?.changes[0]?.value?.messages[0]) return;
    const number = data.entry[0].changes[0].value.messages[0].from;
    const message = data.entry[0].changes[0].value.messages[0] as OficialWhatsappMessage;
    console.log(message);
    const registrating = runningRegistrations.find({ WPP_NUMERO: number });
    const survey = runningSurveys.find(number);
    const attending = runningAttendances.find({ WPP_NUMERO: number });
    const textMsg = message.type === "text" ? message.text!.body : "";

    if (attending) {
        const newMessage = await services.messages.createOficial(message, attending.CODIGO_ATENDIMENTO, attending.CODIGO_OPERADOR, message.context?.id);
        newMessage && runningAttendances.insertNewMessage(attending.CODIGO_ATENDIMENTO, newMessage);
    } else if (registrating) {
        const { registration, reply } = await registrationBot(registrating, textMsg);
        reply && services.whatsapp.replyMessage(message, reply);
        runningRegistrations.update(number, registration);
    } else if (survey && message.type === "text") {
        const { registration, reply } = await surveyBot(survey, textMsg);
        reply && services.whatsapp.replyMessage(message, reply);
        runningSurveys.update(number, registration);
    } else {
        const findNumber = await services.wnumbers.find(number);

        if (findNumber) {
            const findCustomer = await services.customers.getOneById(findNumber.CODIGO_CLIENTE);
            const findAttendance = await services.attendances.find(findNumber.CODIGO);

            if (findAttendance && findCustomer) {
                const newMessage = await services.messages.createOficial(message, findAttendance.CODIGO, findAttendance.CODIGO_OPERADOR, message.context?.id);
                const operatorSession = await Sessions.getOperatorSession(findAttendance.CODIGO_OPERADOR)

                if (newMessage && operatorSession) {
                    services.attendances.startNew({
                        client: findCustomer,
                        number: findNumber,
                        operator: operatorSession,
                        messages: [newMessage]
                    });
                };
            } else if (findCustomer) {
                const findOperator = await services.customers.findOperator(findCustomer.CODIGO);
                const avaliableOperator = await services.attendances.getOperator(findOperator);
                const operator = avaliableOperator && await Sessions.getOperatorSession(avaliableOperator);

                if (operator) {

                    const newAttendance = await services.attendances.startNew({
                        client: findCustomer,
                        number: findNumber,
                        operator: operator,
                    });

                    if (newAttendance) {
                        const reply = `Seu atendimento foi iniciado, você está sendo atendido por ${operator.userData.NOME}.`;
                        const replyFormated: OficialWhatsappMessage = { from: "me", id: "", timestamp: `${Date.now()}`, type: "text", text: { body: reply } };

                        const newMessage = await services.messages.createOficial(message, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, message.context?.id);
                        const savedReply = await services.messages.createOficial(replyFormated, newAttendance.CODIGO, newAttendance.CODIGO_OPERADOR, message.id, true, true);

                        newMessage && services.whatsapp.replyMessage(message, reply);
                        newMessage && runningAttendances.insertNewMessage(newAttendance.CODIGO, newMessage);
                        savedReply && runningAttendances.insertNewMessage(newAttendance.CODIGO, savedReply);
                    };

                } else {
                    console.log(new Date().toLocaleString(), `: Sem operador online para atender: Cliente de ID ${findNumber.CODIGO_CLIENTE} | WPP: ${number}`);
                    console.log(new Date().toLocaleString(), ": Mensagem: ", message.type, " : ", message.text?.body);
                };
            };

        } else {
            const msgTimestamp = Number(`${message.timestamp}000`);
            const isMessageFromNow = (msgTimestamp + 60000) >= Date.now();

            if (isMessageFromNow) {
                const newRegistration = { WPP_NUMERO: number, ETAPA: 1, ETAPA_COUNT: 0, DADOS: {}, CONCLUIDO: false };
                runningRegistrations.create(newRegistration);
                const { registration, reply } = await registrationBot(newRegistration, textMsg);
                reply && services.whatsapp.replyMessage(message, reply);
                runningRegistrations.update(number, registration);
            };
        };
    };
};