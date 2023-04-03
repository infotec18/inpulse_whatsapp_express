import { Router } from "express";
import controllers from "../controllers";

export const numberRoutes = Router();

numberRoutes.get("/api/numbers/:numberId",
    controllers.numbers.getOneById
);