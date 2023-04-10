import { downloadFileService } from "./download.service";
import { returnBase64Service } from "./returnBase64.service";
import { saveAndConvertAudioService } from "./saveAndConvertAudio.service";

export const download = downloadFileService;
export const returnBase64 = returnBase64Service;
export const saveAndConvertAudio = saveAndConvertAudioService;