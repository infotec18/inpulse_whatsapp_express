import { createWNumberController } from "./create.controller";
import { deleteWNumberController } from "./delete.controller";
import { getOneNumberByIdController } from "./getOneById.controller";
import { updateNumberController } from "./update.controller";

export const create = createWNumberController;
export const erase = deleteWNumberController;
export const getOneById = getOneNumberByIdController;
export const update = updateNumberController;