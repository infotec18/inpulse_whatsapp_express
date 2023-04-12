import { insertReadyMessageService } from "./insertMessage.service";
import { updateReadyMessagesService } from "./updateMessage.service";
import { deleteReadyMessageService } from "./deleteMessage.service";
import { getAllReadyMessagesService } from "./getAllMessages.service";
import { getOneReadyMessageService } from "./getOneById.service";

export const create = insertReadyMessageService;
export const update = updateReadyMessagesService;
export const erase = deleteReadyMessageService;
export const getAll = getAllReadyMessagesService;
export const getOneById = getOneReadyMessageService;