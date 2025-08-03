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
