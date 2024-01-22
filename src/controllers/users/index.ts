import { getAllUsersController } from "./getAll.controller";
import { getHistoricoStatusController } from "./getHistoricoStatus.controller";
import { getLastUserIdController } from "./getLastId.controller";
import { getProdutividadeController } from "./getProdutividade.controller";
import { updateUserController } from "./update.controller";

export const getAll = getAllUsersController;
export const getProdutividade = getProdutividadeController;
export const getHistoricoStatus = getHistoricoStatusController;
export const update = updateUserController;
export const getLastId = getLastUserIdController;
