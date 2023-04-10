import { createCustomerService } from "./create.service";
import { getAllCustomersService } from "./getAll.service";
import { getLastCustomerIdService } from "./getLastId.service";
import { getOneCustomersService } from "./getOneById.service";
import { recoverCustomerService } from "./recover.service";
import { deleteCustomerService } from "./softDelete.service";
import { updateCustomerService } from "./update.service";
import { findByCPFCNPJ as findByCPF } from "./findByCPF.service";
import { directCreateCustomerService } from "./directCreate.service";

export const directCreate = directCreateCustomerService;
export const create = createCustomerService;
export const getAll = getAllCustomersService;
export const getOneById = getOneCustomersService;
export const recover = recoverCustomerService;
export const softDelete = deleteCustomerService;
export const update = updateCustomerService;
export const getLastId = getLastCustomerIdService;
export const findByCPFCNPJ = findByCPF;