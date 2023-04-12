import * as fs from 'fs-extra'
import * as path from 'path';
import { AppDataSource } from '../../data-source'
import { ReadyMessageFile } from '../../entities/readyMessageFile.entity'

export async function deleteFileAndRemovePath(CODIGO: number) {
    try {

        const readyMessageFileRepository = AppDataSource.getRepository(ReadyMessageFile);

        const entryToDelete = await readyMessageFileRepository.findOneBy({ CODIGO: CODIGO });

        if(entryToDelete){
            const filePath = path.join(__dirname, '../../../files', entryToDelete.ARQUIVO);
            if(await fs.pathExists(filePath)){
                await fs.unlink(filePath);
            }

            await readyMessageFileRepository.remove(entryToDelete)
        }

    } catch (error) {
        console.error('Error deleting file and removing path:', error);
    }
}