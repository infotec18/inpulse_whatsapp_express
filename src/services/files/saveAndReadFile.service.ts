import { SendFileData } from "../../interfaces/messages.interfaces";
import { ReadStream, createReadStream, writeFileSync } from "fs";
import path from "path";

export function saveAndReadFile(file: SendFileData): Promise<ReadStream> {
    return new Promise<ReadStream>((resolve) => {

        const fileContent = Buffer.from(file.buffer)

        const savePath = path.join(__dirname, '../../../localFiles/messages', file.name);

        writeFileSync(savePath, fileContent);

        setTimeout(() => {
            const readStream = createReadStream(savePath);
            resolve(readStream);
        }, 5000);

    });
};