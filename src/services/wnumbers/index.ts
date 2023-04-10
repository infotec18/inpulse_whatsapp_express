import { createNumberService } from "./create.service";
import { deleteWNumberService } from "./delete.service";
import { findNumberService } from "./find.service";
import { getOneByIdNumberService } from "./getOneById.service";
import { updateWNumberService } from "./update.service";

export const find = findNumberService;
export const getById = getOneByIdNumberService;
export const create = createNumberService;
export const update = updateWNumberService;
export const erase = deleteWNumberService;