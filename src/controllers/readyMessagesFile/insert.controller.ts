import { Request, Response } from "express"
import services from "../../services"
import { ReadyMessageFile } from "../../entities/readyMessageFile.entity"
import { AppError } from "../../errors";

export async function insertReadyMessageFile(req: Request, res: Response) {
    
    const savedEntry: ReadyMessageFile | null = await services.readyMessageFile.insert(req);
  
    if (!savedEntry) {
      return res.status(500).json({ message: 'Error saving file and storing path.' });
    }
  
    return res.status(200).json({ message: 'File saved and path stored successfully.', data: savedEntry });
}