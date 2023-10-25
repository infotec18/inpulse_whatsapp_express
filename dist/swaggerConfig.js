"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentação da API da sua aplicação',
    },
    basePath: '/api', // A base path para suas rotas
};
const options = {
    swaggerDefinition,
    apis: ['./routes/*.ts'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swaggerSpec;
