import { type Request, type Response } from 'express';
import { prisma } from '../prisma.client';
import { AppError } from '@errors/AppError';
import { workoutPlanSchema } from '@schemas/workoutPlanSchema';
import { z } from 'zod';

export class WorkoutPlanController {
  public async createOrUpdate(
    request: Request,
    response: Response
  ): Promise<void> {
    const { studentId } = request.params;
    const content = request.body;
    const teacherId = request.user.id;

    try {
      workoutPlanSchema.createUpdate.parse(content);

      // Verificar se o usuário é professor
      const isTeacher =
        request.user.roles.includes('TEACHER') ||
        request.user.roles.includes('ADMIN');

      if (!isTeacher) {
        throw new AppError(
          'Apenas professores podem criar/editar fichas de treino',
          403
        );
      }

      // Verificar se o aluno existe
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
      });

      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Upsert (cria ou atualiza) a ficha de treino
      const workoutPlan = await prisma.workoutPlan.upsert({
        where: { studentId: Number(studentId) },
        update: {
          content,
          employeeId: teacherId,
        },
        create: {
          content,
          studentId: Number(studentId),
          employeeId: teacherId,
        },
      });

      response.status(200).json(workoutPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Formato da ficha de treino inválido', 400);
      }
      throw error;
    }
  }

  public async get(request: Request, response: Response): Promise<void> {
    const { studentId } = request.params;

    try {
      const workoutPlan = await prisma.workoutPlan.findUnique({
        where: { studentId: Number(studentId) },
        include: {
          student: {
            select: {
              person: {
                select: {
                  name: true,
                },
              },
            },
          },
          updatedBy: {
            select: {
              person: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!workoutPlan) {
        throw new AppError('Ficha de treino não encontrada', 404);
      }

      response.status(200).json({
        ...workoutPlan,
        studentName: workoutPlan.student.person.name,
        teacherName: workoutPlan.updatedBy.person.name,
      });
    } catch (error) {
      throw new AppError('Falha ao buscar ficha de treino', 500);
    }
  }
}

export const workoutPlanController = new WorkoutPlanController();
