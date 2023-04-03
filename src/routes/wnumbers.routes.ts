import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const wnumbersRoutes = Router();

wnumbersRoutes.get('/api/wnumber/:numberId',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.getOneById
)

wnumbersRoutes.post('/api/wnumber',
    controllers.wnumbers.create
)

wnumbersRoutes.put('/api/wnumber/:numberId/update',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.update
)

wnumbersRoutes.delete('/api/wnumber/:numberId/delete',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.delete
)