import { Router } from "express";
import controllers from "../controllers";

export const readyMessageFileRoutes = Router();

readyMessageFileRoutes.get("/api/readymessage/:id",
    controllers.readyMessageFile.getOneById
);

readyMessageFileRoutes.get("/api/readymessage/download/:id",
    controllers.readyMessageFile.download
)

readyMessageFileRoutes.post("/api/readymessage/insert",
    controllers.readyMessageFile.insert
);

readyMessageFileRoutes.delete("/api/readymessage/delete/:codigo",
    controllers.readyMessageFile.delete
)