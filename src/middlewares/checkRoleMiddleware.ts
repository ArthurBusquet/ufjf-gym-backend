import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';

export function checkRole(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles || [];

    if (userRoles.includes('ADMIN')) {
      next();
      return;
    }

    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      throw new AppError('Acesso não autorizado', 403);
    }

    next();
  };
}
