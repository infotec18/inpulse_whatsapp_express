import { Router } from "express";
import controllers from "../controllers";

export const userRoutes = Router();

userRoutes.get("/users/",
    controllers.users.getAll
);
userRoutes.put("/users/", 
    controllers.users.update
);

userRoutes.get("/users/StatusAndVendas",
    controllers.users.getLastId
);
