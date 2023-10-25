"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const errors_1 = require("./errors");
const users_routes_1 = require("./routes/users.routes");
const cors_1 = __importDefault(require("cors"));
const customers_routes_1 = require("./routes/customers.routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = __importDefault(require("./swaggerConfig"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '20mb' }));
app.use((0, cors_1.default)());
// Defina o Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.default));
app.use('/api', users_routes_1.userRoutes);
app.use('/api', customers_routes_1.customerRoutes);
app.use(errors_1.errorHandler);
exports.default = app;
