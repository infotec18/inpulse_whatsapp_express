import { handleFileDeletion } from "./delete.controller";
import { downloadReadyFileController } from "./download.controller";
import { getOneReadyMessageFileById } from "./getOneById.controller";
import { insertReadyMessageFile } from "./insert.controller";


export const erease = handleFileDeletion;
export const download = downloadReadyFileController;
export const getOneById = getOneReadyMessageFileById;
export const insert = insertReadyMessageFile;