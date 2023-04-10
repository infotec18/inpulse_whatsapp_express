import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const readyMessagesRoutes = Router()

readyMessagesRoutes.get('/api/ready-messages', 
    controllers.readyMessages.getAll
);

readyMessagesRoutes.get('/api/ready-messages/:messageId', 
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.getOneById
);

readyMessagesRoutes.post('/api/ready-messages',
    controllers.readyMessages.create
);

readyMessagesRoutes.put('/api/ready-messages/:messageId/update',
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.update
);

readyMessagesRoutes.delete('/api/ready-messages/:messageId/delete', 
    middlewares.readyMessages.ensureParamReadyMessagesIdExists,
    controllers.readyMessages.erase
);