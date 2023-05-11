import { Router } from "express";
import controllers from "../controllers";

export const schedulesRoutes = Router();

schedulesRoutes.get('/schedules/:userId',
    controllers.schedules.getByUserId
);