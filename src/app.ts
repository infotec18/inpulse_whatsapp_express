import 'express-async-errors';
import express, { Application } from 'express';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';
import cors from 'cors';
import { avatarRoutes } from './routes/avatars.routes';
import { costumerRoutes } from './routes/costumers.routes';

const app: Application = express();
app.use(express.json());
app.use(cors());

// Routes:
app.use(userRoutes);
app.use(avatarRoutes);
app.use(costumerRoutes);

app.use(errorHandler);

export default app