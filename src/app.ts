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
import { schedulesRoutes } from './routes/schedules.routes';
import { attendancesRoute } from './routes/attendances.routes';
import { oficialApiRoutes } from './routes/oficialApi.routes';

const app: Application = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors());

app.use('/api',userRoutes);
app.use('/api',avatarRoutes);
app.use('/api',customerRoutes);
app.use('/api',filesRoutes);
app.use('/api',wnumbersRoutes);
app.use('/api',readyMessageFileRoutes);
app.use('/api',readyMessagesRoutes)
app.use('/api',resultsRoutes);
app.use('/api',schedulesRoutes);
app.use('/api',attendancesRoute);

const useOficialApi = process.env.OFICIAL_WHATSAPP === "true";

if(useOficialApi) {
    app.use(oficialApiRoutes);
};

app.use(errorHandler);

export default app;