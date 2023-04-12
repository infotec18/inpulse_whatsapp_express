import { Request, Response } from 'express';
import services from '../../services';

export async function handleFileDeletion(req: Request, res: Response): Promise<Response> {
  const { codigo } = req.params;

  console.log(codigo)

  if (!codigo) {
    return res.status(400).json({ message: 'Missing required parameters.' });
  }

  try {
    await services.readyMessageFile.erease(Number(codigo));

    return res.status(200).json({ message: 'File deleted successfully.' });
  } catch (error) {
    console.error('Error handling file deletion:', error);
    return res.status(500).json({ message: 'Error handling file deletion.' });
  }
}