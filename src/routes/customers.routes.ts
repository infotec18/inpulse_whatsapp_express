import { Router } from "express";
import controllers from "../controllers";
import middlewares from "../middlewares";

export const customerRoutes = Router()

customerRoutes.post("/customers/",
    controllers.customers.create
);

customerRoutes.get("/customers/",
    controllers.customers.getAllCus
);

customerRoutes.get("/customers/:userId",
    middlewares.customers.ensureParamCustomerIdExists,
    controllers.customers.getOneById
);

customerRoutes.delete("/customers/:userId",
    middlewares.customers.ensureParamCustomerIdExists,
    controllers.customers.softDelete
);

customerRoutes.put("/api/customers/:userId/recover",
    middlewares.customers.ensureParamCustomerIdExists,
    controllers.customers.recover
);

customerRoutes.patch("/api/customers/:userId", 
    middlewares.customers.ensureParamCustomerIdExists,
    controllers.customers.update
);

customerRoutes.get("/api/customers/lastid", 
    controllers.customers.getLastId
);

customerRoutes.get("/api/customers/findByOperator/:userId",
    middlewares.auth.ensureTokenIsValid,
    middlewares.customers.ensureParamCustomerIdExists,
    controllers.customers.getByOperatorId
);