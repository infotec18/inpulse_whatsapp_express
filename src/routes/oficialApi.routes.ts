import { Router } from "express";
import controllers from "../controllers";

export const oficialApiRoutes = Router();

oficialApiRoutes.post("/api/whatsapp/",
    controllers.whatsapp.receiveMessage
);