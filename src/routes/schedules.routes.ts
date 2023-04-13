import { Router } from "express";
import controllers from "../controllers";

export const schedulesRoutes = Router();

schedulesRoutes.get('/api/schedules/:userId',
    controllers.schedules.getByUserId
);

schedulesRoutes.put('/api/schedules/:Id',
    controllers.schedules.updateById
);