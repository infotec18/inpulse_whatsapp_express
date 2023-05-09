import axios from "axios";
import { OficialWhatsappMessage } from "../../interfaces/messages.interfaces";

export async function sendWhatsappMessageTemplatesVariablesService(variables: Array<string>, template: OficialWhatsappMessage) {
    let parameters: Array<{ type: string, text: string }> = [];
    for (let variable of variables) {
        parameters.push({ type: "text", text: variable });
    } 
    await axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
        recipient_type: "individual",
        context: {
            message_id: template.id
        },
        messaging_product: "whatsapp",
        to: template.from,
        type: "template",
        template: {
            name: template.name,
            components: [
              {
                type: "body",
                parameters: parameters
              }
            ]
        }
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }).catch(err => {
        console.log(err.response.data)
    })
    
    return template;
};
