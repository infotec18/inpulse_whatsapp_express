import { Router } from "express";
import controllers from "../controllers";

export const oficialApiRoutes = Router();

oficialApiRoutes.get("/api/whatsapp/",
    controllers.users.getAll
);