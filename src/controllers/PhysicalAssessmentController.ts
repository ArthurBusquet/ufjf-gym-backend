import { type Request, type Response } from 'express';
import { prisma } from '../prisma.client';
import { AppError } from '@errors/AppError';
import { physicalAssessmentSchema } from '@schemas/physicalAssessmentSchema';
import { z } from 'zod';

export class PhysicalAssessmentController {
  public async create(request: Request, response: Response): Promise<void> {
    const { studentId } = request.params;
    const data = request.body;

    if (!request.user?.employeeId) {
      throw new AppError('Apenas funcionários podem criar avaliações', 403);
    }

    try {
      // Validar dados de entrada
      physicalAssessmentSchema.createUpdate.parse(data);

      // Verificar se o aluno existe
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
      });

      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      // Criar nova avaliação física
      const assessment = await prisma.physicalAssessment.create({
        data: {
          ...data,
          studentId,
          teacherId: request.user.employeeId,
        },
      });

      response.status(201).json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Dados inválidos: ' + error.errors[0].message, 400);
      }
      throw new AppError('Falha ao criar avaliação', 500);
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    const { assessmentId } = request.params;
    const data = request.body;

    if (!request.user?.employeeId) {
      throw new AppError('Apenas funcionários podem editar avaliações', 403);
    }

    try {
      // Validar dados de entrada
      physicalAssessmentSchema.createUpdate.parse(data);

      // Verificar se a avaliação existe
      const existingAssessment = await prisma.physicalAssessment.findUnique({
        where: { id: Number(assessmentId) },
      });

      if (!existingAssessment) {
        throw new AppError('Avaliação não encontrada', 404);
      }

      // Verificar se o usuário é o criador da avaliação
      if (existingAssessment.teacherId !== Number(request.user.employeeId)) {
        throw new AppError('Você só pode editar suas próprias avaliações', 403);
      }

      // Atualizar a avaliação física
      const updatedAssessment = await prisma.physicalAssessment.update({
        where: { id: Number(assessmentId) },
        data,
      });

      response.status(200).json(updatedAssessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError('Dados inválidos: ' + error.errors[0].message, 400);
      }
      throw new AppError('Falha ao atualizar avaliação', 500);
    }
  }

  public async getByStudent(
    request: Request,
    response: Response
  ): Promise<void> {
    const { studentId } = request.params;

    try {
      // Buscar todas as avaliações do aluno
      const assessments = await prisma.physicalAssessment.findMany({
        where: { studentId: Number(studentId) },
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            include: {
              person: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      response.status(200).json(assessments);
    } catch (error) {
      throw new AppError('Falha ao buscar avaliações', 500);
    }
  }
}

export const physicalAssessmentController = new PhysicalAssessmentController();
