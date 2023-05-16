import { Router } from "express";
import controllers from "../controllers";

export const readyMessageFileRoutes = Router();

readyMessageFileRoutes.get("/readymessage/:id",
    controllers.readyMessageFile.getOneById
);

readyMessageFileRoutes.get("/readymessage/download/:id",
    controllers.readyMessageFile.download
)

readyMessageFileRoutes.post("/readymessage/insert",
    controllers.readyMessageFile.insert
);

readyMessageFileRoutes.delete("/readymessage/delete/:codigo",
    controllers.readyMessageFile.erease
)