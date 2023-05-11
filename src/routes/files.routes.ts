import { Router } from "express";
import controllers from "../controllers";

export const filesRoutes = Router();

filesRoutes.get("/files/messages/download/:id",
    controllers.files.download
);

filesRoutes.get("/files/messages/base64/:id",
    controllers.files.base64
);