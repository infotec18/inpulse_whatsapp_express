import 'express-async-errors';
import express, { Application } from 'express';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';
import cors from 'cors';
import { avatarRoutes } from './routes/avatars.routes';
import { customerRoutes } from './routes/customers.routes';
import { numberRoutes } from './routes/numbers.routes';
import { filesRoutes } from './routes/files.routes';

const app: Application = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors());


// Routes:
app.use(userRoutes);
app.use(avatarRoutes);
app.use(customerRoutes);
app.use(numberRoutes);
app.use(filesRoutes);

app.use(errorHandler);


export default app