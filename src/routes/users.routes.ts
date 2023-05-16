import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";
import { fastEnsureTokenIsValid } from "../middlewares/auth/fastEnsureTokenIsValid.middleware";

export const userRoutes = Router();

userRoutes.post("/users/",
    controllers.users.create
);

userRoutes.get("/users/",
    middlewares.auth.ensureTokenIsValid,
    controllers.users.getAll
);

userRoutes.post("/users/login",
    controllers.users.login
);

userRoutes.get("/users/status",
    fastEnsureTokenIsValid,
    controllers.users.getOneById
);

userRoutes.delete("/users/:userId",
    middlewares.users.ensureParamUserIdExists,
    controllers.users.softDelete
);

userRoutes.put("/users/:userId/recover",
    middlewares.users.ensureParamUserIdExists,
    controllers.users.recover
);

userRoutes.patch("/users/:userId", 
    middlewares.users.ensureParamUserIdExists,
    controllers.users.update
);

userRoutes.get("/users/lastid",
    controllers.users.getLastId
);

userRoutes.get("/users/specified",
    controllers.users.getSpecified
)