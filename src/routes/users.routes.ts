import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const userRoutes = Router();

userRoutes.post("/api/users/",
    controllers.users.create
);

userRoutes.get("/api/users/",
    controllers.users.getAll
);

userRoutes.post("/api/users/login",
    controllers.users.login
);

userRoutes.get("/api/users/status",
    middlewares.auth.ensureTokenIsValid,
    controllers.users.getOneById
);

userRoutes.delete("/api/users/:userId",
    middlewares.users.ensureParamUserIdExists,
    controllers.users.softDelete
);

userRoutes.put("/api/users/:userId/recover",
    middlewares.users.ensureParamUserIdExists,
    controllers.users.recover
);

userRoutes.patch("/api/users/:userId/", 
    middlewares.users.ensureParamUserIdExists,
    controllers.users.update
);