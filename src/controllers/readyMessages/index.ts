import { createReadyMessageController } from "./create.controller";
import { updateReadyMessageController } from "./update.controller";
import { deleteReadyMessageController } from "./delete.controller";
import { getAllReadyMessagesController } from "./getAll.controller";
import { getOneReadyMessageByIdController } from "./getOneById.controller";

export const create = createReadyMessageController;
export const update = updateReadyMessageController;
export const erase = deleteReadyMessageController;
export const getAll = getAllReadyMessagesController;
export const getOneById = getOneReadyMessageByIdController;
