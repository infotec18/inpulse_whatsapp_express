import express, { Application, application, json } from 'express';
import 'express-async-errors';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';

const app: Application = express();
app.use(express.json());

// Routes:
app.use(userRoutes)

app.use(errorHandler);

export default app