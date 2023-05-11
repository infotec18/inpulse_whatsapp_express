import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const readyMessagesRoutes = Router()

readyMessagesRoutes.get('/ready-messages', 
    controllers.readyMessages.getAll
);

readyMessagesRoutes.get('/ready-messages/:messageId', 
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.getOneById
);

readyMessagesRoutes.post('/ready-messages',
    controllers.readyMessages.create
);

readyMessagesRoutes.put('/ready-messages/:messageId/update',
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.update
);

readyMessagesRoutes.delete('/ready-messages/:messageId/delete', 
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.erase
);