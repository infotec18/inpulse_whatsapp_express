import axios from "axios";
import { OficialWhatsappMessageTemplate } from "../../interfaces/messages.interfaces";
import { User } from "../../entities/user.entity";
import { Wnumber } from "../../entities/wnumber.entity";
import { replaceParameterService } from "./replaceParameter.service";

interface Params {
    template: OficialWhatsappMessageTemplate;
    whatsappNumber: Wnumber;
    operator: User;
};

export async function sendWhatsappTemplateService({ template, whatsappNumber, operator }: Params) {
    const templateComponents = template.components;

    const variables = await Promise.all(templateComponents.map(async (c) => {
        if (c.type === "HEADER" && c.example && c.example.header_text) {
            const parameter = await replaceParameterService({ str: c.example.header_text[0], contact: whatsappNumber, operator });

            return {
                type: "header",
                parameters: [
                    {
                        type: "text",
                        text: parameter,
                    },
                ],
            };
        } else if (c.type === "BODY" && c.example && c.example.body_text) {
            const parameters: string[] = [];
            
            for(let s of c.example.body_text[0]) {
                const parameter = await replaceParameterService({ str: s, contact: whatsappNumber, operator });
                parameters.push(parameter)
            };
            
            if (parameters.length > 0) {
                return {
                    type: "body",
                    parameters: parameters.map((p) => ({ type: "text", text: p })),
                };
            };
        }
    }));

    const requestBody = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: whatsappNumber.NUMERO,
        type: "template",
        template: {
            name: template.name,
            language: {
                code: template.language,
            },
            components: variables.filter((v) => !!v)
        },
    };

    const response = await axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, requestBody, {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
        },
    })
    .then(res => res.data.messages[0].id as string)
    .catch(err => console.log(err.response.data));

    return response
};