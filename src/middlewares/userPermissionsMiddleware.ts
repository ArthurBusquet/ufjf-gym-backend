/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';

// Verifica se usuário pode criar funcionários

export function canCreateEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  // Apenas admin pode criar funcionários
  if (!user?.roles.includes('ADMIN')) {
    throw new AppError('Apenas administradores podem criar funcionários', 403);
  }

  next();
}

// Verifica se usuário pode criar alunos
export function canCreateStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  // Admin e recepcionistas podem criar alunos
  if (!user?.roles.includes('ADMIN') && !user?.roles.includes('RECEPTIONIST')) {
    throw new AppError(
      'Apenas administradores e recepcionistas podem criar alunos',
      403
    );
  }

  next();
}
