import 'express-async-errors';
import express, { Application } from 'express';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';
import cors from 'cors';
import { customerRoutes } from './routes/customers.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig'; 

const app: Application = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors());

// Defina o Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', userRoutes);
app.use('/api', customerRoutes);

app.use(errorHandler);

export default app;
