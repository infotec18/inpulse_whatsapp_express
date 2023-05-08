import axios from "axios";
import { OficialWhatsappMessage } from "../../interfaces/messages.interfaces";

export async function replyWhatsappMessageService(message: OficialWhatsappMessage, reply: string) {
    axios.post(`https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`, {
            recipient_type: "individual",
            context: {
                message_id: message.id
            },
            messaging_product: "whatsapp",
            to: message.from,
            type: "text",
            text: {
                body: reply
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }).catch(err => {
            console.log(err.response.data)
        })
};