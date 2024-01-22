import { Router } from "express";
import controllers from "../controllers";

export const userRoutes = Router();

userRoutes.get("/users/",
    controllers.users.getAll
);
userRoutes.get("/users/produtividade",
    controllers.users.getProdutividade
);
userRoutes.get("/users/statusHistorico",
    controllers.users.getHistoricoStatus
);
userRoutes.get("/users/",
    controllers.users.getAll
);
userRoutes.put("/users/", 
    controllers.users.update
);

userRoutes.get("/users/StatusAndVendas",
    controllers.users.getLastId
);
