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
  console.log('=== ensureAuthenticated middleware ===');
  console.log('URL:', request.url);
  console.log('Method:', request.method);
  console.log('Headers:', request.headers);
  
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    console.log('Token não recebido');
    throw new AppError('Token não recebido', 401);
  }

  // Verificar formato do header
  const [scheme, token] = authHeader.split(' ');

  if (!/^Bearer$/i.test(scheme) || !token) {
    console.log('Formato de token inválido');
    throw new AppError('Formato de token inválido', 401);
  }

  console.log('Token recebido:', token.substring(0, 20) + '...');

  const { secret } = authConfig.options.jwt;

  try {
    // Verificar e decodificar o token
    const decoded = verify(token, secret) as JwtPayload;
    console.log('Token decodificado:', {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles,
      employeeId: decoded.employeeId,
      studentId: decoded.studentId
    });

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

    console.log('Usuário adicionado ao request:', request.user);
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expirado', 401);
    }
    throw new AppError('Token inválido', 401);
  }
}
