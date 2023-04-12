import { deleteFileAndRemovePath } from "./delete.service";
import { downloadReadyFileService } from "./download.service";
import { getOneReadyFileById } from "./getOneById.service";
import { insertFile } from "./insert.service";


export const erease = deleteFileAndRemovePath;
export const download = downloadReadyFileService;
export const getOneById = getOneReadyFileById;
export const insert = insertFile;