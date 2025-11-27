import express from 'express';
import router from '.';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptionsDelegate } from './middleware/cors';
import { log } from './middleware/logger';
import { limiter } from './middleware/limiter';
import { errorHandler404 } from './middleware/errorHandler404';
import { errorHandler } from './middleware/errorHandler';
import { responseHandler } from './middleware/responseHandler';

const app = express();

// Global middlewares
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-urlencoded data
app.use(responseHandler as express.RequestHandler);
app.use(log);
app.use(helmet());
app.use(limiter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main router
app.use(router);

// 404 handler (for unmatched routes)
app.use(errorHandler404);

// error handler
app.use(errorHandler);

export default app;
