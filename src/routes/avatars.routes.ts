import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const avatarRoutes = Router();

avatarRoutes.post("/api/users/:userId/avatar",
    middlewares.users.ensureParamUserIdExists,
    controllers.avatars.insert
);

avatarRoutes.get("/api/users/:userId/avatar",
    middlewares.users.ensureParamUserIdExists,
    controllers.avatars.getOneByUserId
);