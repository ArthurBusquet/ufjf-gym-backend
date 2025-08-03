/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// ensureSameStudentOrEmployee.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';
import { prisma } from '../prisma.client';

export function ensureSameStudentOrEmployee(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id;
  const studentId = req.params.studentId;

  // Admin e professores podem acessar qualquer ficha
  if (
    req.user.roles.includes('ADMIN') ||
    req.user.roles.includes('TEACHER') ||
    req.user.roles.includes('RECEPTIONIST') ||
    req.user.roles.includes('TRAINEE')
  ) {
    return next();
  }

  console.log('User ID:', userId);
  // Aluno só pode acessar a própria ficha
  prisma.student
    .findUnique({
      where: { id: Number(studentId) },
      include: { person: true },
    })
    .then((student) => {
      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      if (student.personId !== userId) {
        throw new AppError('Acesso não autorizado', 403);
      }

      next();
    })
    .catch((error) => {
      next(error);
    });
}
