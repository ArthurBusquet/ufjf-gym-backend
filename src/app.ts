import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import 'express-async-errors';
import cors from 'cors';

import { router } from '@routes/routes';
import { AppError } from '@errors/AppError';

const app = express();
app.use(express.json());

app.use(cors());

// Health check endpoint - usado pelo frontend para verificar disponibilidade do backend
app.get('/api/health', (_: Request, response: Response) => {
  response.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use(router);
app.disable('x-powered-by');

app.use((err: Error, _: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: `Internal server error - ${err.message}`,
  });
});

export { app };
