import { receiveWhatsappMessageController } from "./receiveMessage.controller";
import { recoverWhatsappMessageTemplatesController } from "./recoverMessageTemplates.controller";
import { sendTemplateVariablesController } from "./sendTemplatesVariables.controller";

export const receiveMessage = receiveWhatsappMessageController;
export const recoverMessageTemplates = recoverWhatsappMessageTemplatesController;
export const sendTemplateVariables = sendTemplateVariablesController;