import { Router } from "express";
import controllers from "../controllers";

export const readyMessageFileRoutes = Router();

readyMessageFileRoutes.get("/api/readymessage/:id",
    controllers.readyMessageFile.getOneById
);

readyMessageFileRoutes.post("/api/readymessage/insert",
    controllers.readyMessageFile.insert
);

readyMessageFileRoutes.put("/api/readymessage/update/:id",
    controllers.readyMessageFile.update
)

readyMessageFileRoutes.delete("/api/readymessage/delete/:id",
    controllers.readyMessageFile.delete
)