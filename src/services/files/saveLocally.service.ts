import { SendFileData } from "../../interfaces/messages.interfaces";
import { readFileSync, unlinkSync, writeFile, writeFileSync } from "fs";
import path from "path";
import ffmpeg from 'fluent-ffmpeg';

export function saveFileLocallyService(file: SendFileData): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const fileContent = Buffer.from(file.base64, 'base64');

        const i = file.type.split("").findIndex(e => e === "/");
        const j = file.type.split("").slice(i+1).findIndex(e => e === ";");
        const ext = file.type.slice(i+1).slice(0, j);

        const filePath = "./localFiles/messages";
        const filenameWebm = `${file.name}.${ext}`;
        const filenameOgg = `${file.name}.ogg`;
        
        writeFileSync(`${filePath}/${filenameWebm}`, fileContent);

        const savePath = path.join(__dirname, '../../../localFiles/messages', filenameWebm);
        const newPath = path.join(__dirname, '../../../localFiles/messages', filenameOgg);

        ffmpeg(savePath)
            .outputOptions('-c:a', 'libopus')
            .outputOptions('-b:a', '64k')
            .outputOptions('-vbr', 'on')
            .outputOptions('-compression_level', '10')
            .outputOptions('-frame_duration', '60')
            .outputOptions('-application', 'voip')
            .output(newPath)
            .on('end', () => {
                // Lê o arquivo de saída em formato ogg
                const oggBuffer = readFileSync(newPath);

                // Codifica o arquivo em Base64
                const base64Ogg = oggBuffer.toString('base64');

                unlinkSync(savePath);
                unlinkSync(newPath);
                
                // Aqui você pode fazer o que quiser com o arquivo em formato ogg codificado em Base64
                resolve(base64Ogg);

 
        })
        .on('error', (err: any) => {
            reject(err);
        })
        .run();
    });
};