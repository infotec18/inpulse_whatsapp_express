export interface WhatsappChatMessage {
    body: string;
    _data:  {
        id: {
            fromMe: boolean;
        }
        type: "chat";
        t: number;
    };
};

export interface WhatsappFileMessage {
    _data: {
        id: {
            fromMe: boolean;
        }
        type: "image";
        caption: string;
        mimetype: string;
        data: string;
        size: number;
        t: number;
        body: string;
    }
};

export type WhatsappMessage = WhatsappChatMessage | WhatsappFileMessage;
// new MessageMedia(mimetype, data, filename, filesize)