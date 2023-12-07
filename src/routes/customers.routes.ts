import { Router } from "express";
import controllers from "../controllers";

export const customerRoutes = Router()

customerRoutes.get("/customers/",
    controllers.customers.getAllCus
);

