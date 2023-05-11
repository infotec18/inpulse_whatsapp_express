import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";
import { getAllContactsController } from "../controllers/Wnumbers/getContacts.controler";

export const wnumbersRoutes = Router();

wnumbersRoutes.get('/wnumber',
    controllers.wnumbers.getAllWNumbers
)

wnumbersRoutes.get('/wnumber/:numberId',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.getOneById
);

wnumbersRoutes.post('/wnumber',
    controllers.wnumbers.create
);

wnumbersRoutes.put('/wnumber/:numberId/update',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.update
);

wnumbersRoutes.delete('/wnumber/:numberId/delete',
    middlewares.wnumbers.ensureParamNumberIdExists,
    controllers.wnumbers.erase
);

wnumbersRoutes.get('/contacts/',
    getAllContactsController
);