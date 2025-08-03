import { Router } from 'express';

import { AuthController as AuthControllerClass } from '@controllers/AuthController';
import { validate } from '@middlewares/validateMiddleware';
import { loginSchema } from '@schemas/loginSchema';

const authRoutes = Router();

const AuthController = new AuthControllerClass();

authRoutes.post(
  '/login',
  validate(loginSchema.login),
  AuthController.login.bind(AuthController)
);

export { authRoutes };
