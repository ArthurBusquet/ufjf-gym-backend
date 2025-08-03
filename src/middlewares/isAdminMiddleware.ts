import { type NextFunction, type Request, type Response } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '@config/auth';
import { AppError } from '@errors/AppError';

interface IPayload {
  role: 'ADMIN' | 'USER';
}

export async function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (authHeader === undefined || authHeader === '') {
    throw new AppError('Token não recebido', 401);
  }

  const { secret } = authConfig.options.jwt;

  const [, token] = authHeader.split(' ');

  try {
    const { role } = verify(token, secret, {
      ignoreExpiration: false,
    }) as IPayload;

    if (role !== 'ADMIN')
      throw new AppError('Você não tem permissão para realizar essa ação', 403);

    next();
  } catch {
    throw new AppError('Você não tem permissão para realizar essa ação', 403);
  }
}
