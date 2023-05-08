import axios from "axios";
import { RecoverTemplatesResponse } from "../../interfaces/messages.interfaces";

export async function recoverWhatsappMessageTemplatesService() {
    const templates = axios.get<RecoverTemplatesResponse>(
        `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_ACCOUNT_ID}/message_templates?limit=100`,
        {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
            }
        }
    )
    .then(res => res.data)
    .catch(err => null);
    
    return templates;
};