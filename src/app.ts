import 'express-async-errors';
import express, { Application } from 'express';
import { errorHandler } from './errors';
import { userRoutes } from './routes/users.routes';
import cors from 'cors';
import { avatarRoutes } from './routes/avatars.routes';
import { customerRoutes } from './routes/customers.routes';
import { filesRoutes } from './routes/files.routes';
import { wnumbersRoutes } from './routes/wnumbers.routes';
import { readyMessageFileRoutes } from './routes/readyMessageFile.routes';
import { readyMessagesRoutes } from './routes/readyMessages.routes';
import { resultsRoutes } from './routes/results.routes';

const app: Application = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors());

app.use(userRoutes);
app.use(avatarRoutes);
app.use(customerRoutes);
app.use(filesRoutes);
app.use(wnumbersRoutes);
app.use(readyMessageFileRoutes);
app.use(readyMessagesRoutes)
app.use(resultsRoutes);

app.use(errorHandler);

export default app;