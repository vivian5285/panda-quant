import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes/Index';
import { setupSecurity } from './middleware/security';

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security setup
setupSecurity(app);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app; 