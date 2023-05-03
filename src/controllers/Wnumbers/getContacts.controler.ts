import { Request, Response } from "express";
import { getContactsWithCompanyDetailsService } from "../../services/wnumbers/getContacts.service";

export const getAllContactsController = async (req: Request, res: Response) => {
    const allContacts = await getContactsWithCompanyDetailsService();
    return res.status(201).json(allContacts);
};