import swaggerJSDoc from 'swagger-jsdoc';

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

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
