import WAWebJS from "whatsapp-web.js";

export interface WhatsappChatMessage {
    body: string;
    _data:  {
        id: {
            fromMe: boolean;
            id: string;
            _serialized: string;
        }
        type: "chat";
        t: number;
        quotedStanzaID?: string
    };
};

export interface WhatsappFileMessage {
    _data: {
        id: {
            fromMe: boolean;
            id: string;
            _serialized: string;
        }
        type: "image";
        caption: string;
        mimetype: string;
        data: string;
        size: number;
        t: number;
        body: string;
        quotedStanzaID?: string;  
    };
};

export type WhatsappMessage = WhatsappChatMessage | WhatsappFileMessage;

export interface SendMessageData {
    chatId: string;
    text: string;
    referenceId: string;
    type: SendMessageType;
    file: null | SendFileData;
};

export interface SendFileData {
    name: string;
    type: string;
    base64: string;
};

export type SendMessageType = "chat" | "media" | "audio";