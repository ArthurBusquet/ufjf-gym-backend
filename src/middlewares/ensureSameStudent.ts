/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@errors/AppError';
import { prisma } from '../prisma.client';

export function ensureSameStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user.id; // personId do token
  const studentId = req.params.studentId;

  // Se for admin, professor, etc., permite
  if (req.user.roles.some((role) => ['ADMIN', 'TEACHER'].includes(role))) {
    return next();
  }

  // Se for aluno, verifica se o studentId pertence a ele
  prisma.student
    .findUnique({
      where: { id: Number(studentId) },
    })
    .then((student) => {
      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Verifica se o student corresponde ao personId do token
      if (student.personId !== userId) {
        throw new AppError('Acesso não autorizado', 403);
      }

      next();
    })
    .catch((error) => {
      next(error);
    });
}
