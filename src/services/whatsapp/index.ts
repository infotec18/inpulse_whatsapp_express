
import { receiveWhatsappMessageService } from "./receiveMessage.service";
import { recoverWhatsappMessageTemplatesService } from "./recoverMessageTemplates.service";
import { replyWhatsappMessageService } from "./replyMessage.service";
import { sendWhatsappMessageTemplatesVariablesService } from "./sendTemplatesVariables.service";

export const receiveMessage = receiveWhatsappMessageService;
export const replyMessage = replyWhatsappMessageService;
export const recoverMessageTemplates = recoverWhatsappMessageTemplatesService;
export const sendTemplateVariables = sendWhatsappMessageTemplatesVariablesService;
