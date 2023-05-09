import { ReadStream } from "fs";
import FormData from "form-data"
import axios from "axios";

export class OficialMessageMedia {
    file: ReadStream | null = null;
    type: string | null = null;

    constructor(file: ReadStream, type: string) {
        this.file = file;
        this.type = type;
    };

    async getMediaId() {
        const form = new FormData();

        form.append('file', this.file);
        form.append('type', this.type);
        form.append('messaging_product', "whatsapp");

        const headers = form.getHeaders();
    
        const mediaId = await axios.post<{ id: string }>(
            `https://graph.facebook.com/v16.0/${process.env.WHATSAPP_NUMBER_ID}/media`, 
            form, 
            {
                headers: {
                    ...headers,
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`
                }
            }
        )
        .then((res) => res.data.id)
        .catch((error) => null );

        if(!mediaId) console.log("Failed to upload media...");
        return mediaId;
    };
};