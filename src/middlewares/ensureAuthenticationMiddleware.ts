import { type NextFunction, type Request, type Response } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';

import { authConfig } from '@config/auth';
import { AppError } from '@errors/AppError';

// Interface para o payload do token
interface JwtPayload {
  id: number;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  cpf: string;
  tenure?: number;
  employeeId?: string;
  studentId?: string;
  iat: number;
  exp: number;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não recebido', 401);
  }

  // Verificar formato do header
  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    throw new AppError('Formato de token inválido', 401);
  }

  const { secret } = authConfig.options.jwt;

  try {
    // Verificar e decodificar o token
    const decoded = verify(token, secret) as JwtPayload;

    // Adicionar usuário ao request
    request.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles,
      avatar: decoded.avatar,
      cpf: decoded.cpf,
      tenure: decoded.tenure,
      iat: decoded.iat,
      exp: decoded.exp,
      employeeId: decoded.employeeId,
      studentId: decoded.studentId,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expirado', 401);
    }
    throw new AppError('Token inválido', 401);
  }
}
