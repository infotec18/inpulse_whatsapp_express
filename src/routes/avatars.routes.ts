import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const avatarRoutes = Router();

avatarRoutes.post("/users/:userId/avatar",
    middlewares.users.ensureParamUserIdExists,
    controllers.avatars.insert
);

avatarRoutes.get("/users/:userId/avatar",
    middlewares.users.ensureParamUserIdExists,
    controllers.avatars.getOneByUserId
);