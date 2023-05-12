import axios from "axios";
import { MessageType } from "../../interfaces/messages.interfaces";
import { OficialWhatsappMessage } from "../../interfaces/messages.interfaces";
import { RunningAttendance } from "../../interfaces/attendances.interfaces";
import { runningAttendances } from "../../WebSocket/WhatsappClient";
import services from "..";

interface Props {
    to: string;
    type: MessageType;
    text: string;
    fileId?: string;
    caption?: string;
    fromBot?: boolean;
}

export async function sendWhatsappMessageService({ to, type, text, fileId, caption, fromBot }: Props) {
    const body: Partial<OficialWhatsappMessage & { recipient_type: string, messaging_product: string, to: string}> = {
        recipient_type: "individual",
        messaging_product: "whatsapp",
        to,
        type,
        [type]: {}  
    };
    
    const headers = { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` };

    if(fileId && body.audio) body.audio.id = fileId;
    else if(fileId && body.document) body.document.id = fileId;
    else if(fileId && body.image) body.image.id = fileId;
    else if(fileId && body.video) body.video.id = fileId;

    if(caption && body.image) body.image.caption = caption;
    if(text && body.text) body.text.body = text;

    const message = await axios.post(
        `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/messages`,
        body,
        { headers: headers }
    ).then(async(res) => {
        const ra: RunningAttendance | undefined = runningAttendances.find({ WPP_NUMERO: to });
        
        if(ra) {
            const newMessage = await services.messages.createOficial({
                from: 'me',
                type: type,
                timestamp: `${Date.now()}`.slice(3),
                id: res.data.messages[0].id,
                [type]: {
                    id: fileId,
                    body: text
                }}, ra.CODIGO_ATENDIMENTO, ra.CODIGO_OPERADOR, null, true, true);
                
            newMessage && runningAttendances.update(ra.CODIGO_ATENDIMENTO, { MENSAGENS: [...ra.MENSAGENS, newMessage] }); 
        };
    }).catch(err => {
        console.log(err.request)
    })
};