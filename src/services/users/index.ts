import { getAllUsersService } from "./getAll.service";
import { getLastUserIdService } from "./getGraphicAndTime.service";
import { getHistoricoStatusService } from "./getHistoricoStatus.service";
import { getProdutividadeService } from "./getProdutividade.service";
import { updateUserService } from "./update.service";

export const getAll = getAllUsersService;
export const getProdutividade = getProdutividadeService;
export const getHistoricoStatus = getHistoricoStatusService;
export const update = updateUserService;
export const getLastId = getLastUserIdService;
