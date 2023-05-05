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
    buffer: ArrayBuffer;
};

export type SendMessageType = "chat" | "media" | "audio";

export interface OficialWhatsappMessage {
    context?: {
        from: string;
        id: string;
    };
    from: string;
    id: string;
    timestamp: string;
    type: MessageType;
    document?: {
        mime_type: string;
        id: string;
    };
    image?: {
        mime_type: string;
        caption?: string;
        id: string;
    };
    video?: {
        mime_type: string;
        id: string;
    };

    audio?: {
        mime_type: string;
        id: string;
    };
    text?: {
        body: string;
    };
};

export type MessageType = "document" | "image" | "video" | "audio" | "text";

export interface FileResponse {
    url: string
    mime_type: string,
    sha256: string,
    file_size: number,
    id: string,
    messaging_product: string
};