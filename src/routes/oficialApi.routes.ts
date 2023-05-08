import { Router } from "express";
import controllers from "../controllers";

export const oficialApiRoutes = Router();

oficialApiRoutes.post("/whatsapp/message",
    controllers.whatsapp.receiveMessage
);

oficialApiRoutes.get("/whatsapp/message_templates",
    controllers.whatsapp.recoverMessageTemplates
);