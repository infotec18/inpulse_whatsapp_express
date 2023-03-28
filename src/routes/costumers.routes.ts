import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const costumerRoutes = Router()

costumerRoutes.post("/api/costumers/",
    controllers.costumers.create
);

costumerRoutes.get("/api/costumers/",
    controllers.costumers.getAll
);

costumerRoutes.get("/api/costumers/:userId",
    middlewares.costumers.ensureParamCostumerIdExists,
    controllers.costumers.getOneById
)

costumerRoutes.delete("/api/costumers/:userId",
    middlewares.costumers.ensureParamCostumerIdExists,
    controllers.costumers.softDelete
);

costumerRoutes.put("/api/costumers/:userId/recover",
    middlewares.costumers.ensureParamCostumerIdExists,
    controllers.costumers.recover
);

costumerRoutes.patch("/api/costumers/:userId", 
    middlewares.costumers.ensureParamCostumerIdExists,
    controllers.costumers.update
);

costumerRoutes.get("/api/costumers/lastid", 
    controllers.costumers.getLastId
)