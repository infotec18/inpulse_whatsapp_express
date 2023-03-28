import 'express-async-errors';
import express, { Application } from 'express';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';
import cors from 'cors';

const app: Application = express();
app.use(express.json());
app.use(cors());

// Routes:
app.use(userRoutes)

app.use(errorHandler);

export default app