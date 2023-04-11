import { Router } from "express";
import controllers from "../controllers";

export const resultsRoutes = Router();

resultsRoutes.get("/api/results/",
    controllers.results.getAllFromWhatsapp
);