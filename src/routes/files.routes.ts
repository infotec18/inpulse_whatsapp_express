import { Router } from "express";
import controllers from "../controllers";

export const filesRoutes = Router();

filesRoutes.get("/api/files/download/:id",
    controllers.files.download
);

filesRoutes.get("/api/files/base64/:id",
    controllers.files.base64
);