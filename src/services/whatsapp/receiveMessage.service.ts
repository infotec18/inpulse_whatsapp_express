import { Request } from "express";

export async function receiveWhatsappMessageService (data: any) {
    let number = data.entry[0].changes[0].value.messages[0].from; 
    console.log(number);

    let msg_body = data.entry[0].changes[0].value.messages[0].text.body; 
};