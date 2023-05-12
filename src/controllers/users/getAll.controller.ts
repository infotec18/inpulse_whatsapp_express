import { Request, Response } from "express";
import services from "../../services";

export const getAllUsersController = async (req: Request, res: Response) => {

    if(!req.user.isAdmin) return res.status(401).json({ message: "No authorization" })

    const limite = Number(req.query.limite) || 10;
    const pagina = Number(req.query.pagina) || 1;
    const search = req.query.search?.toString() || undefined;

    const { dados, total } = await services.users.getAll(limite, pagina, search);

    const totalPaginas = Math.ceil(total / limite);

    return res.status(201).json({ dados, total, totalPaginas });
};