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
    const teacherPersonId = request.user.id;

    console.log('=== WorkoutPlanController.createOrUpdate ===');
    console.log('Student ID:', studentId);
    console.log('Teacher Person ID:', teacherPersonId);
    console.log('Request body:', JSON.stringify(content, null, 2));
    console.log('User roles:', request.user.roles);

    try {
      console.log('Validando schema...');
      workoutPlanSchema.createUpdate.parse(content);
      console.log('Schema validado com sucesso!');

      // Verificar se o usuário é professor
      const isTeacher =
        request.user.roles.includes('TEACHER') ||
        request.user.roles.includes('ADMIN');

      console.log('Is teacher?', isTeacher);

      if (!isTeacher) {
        throw new AppError(
          'Apenas professores podem criar/editar fichas de treino',
          403
        );
      }

      // Verificar se o aluno existe
      console.log('Buscando aluno com ID:', studentId, 'Tipo:', typeof studentId);
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
      });

      console.log('Student found:', !!student);
      if (student) {
        console.log('Student details:', {
          id: student.id,
          personId: student.personId,
          createdAt: student.createdAt
        });
      }

      if (!student) {
        // Vamos verificar se há alunos no banco
        const allStudents = await prisma.student.findMany({
          include: {
            person: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });
        console.log('Todos os alunos no banco:', allStudents.map(s => ({
          studentId: s.id,
          personId: s.personId,
          name: s.person.name,
          email: s.person.email
        })));
        
        throw new AppError('Aluno não encontrado', 404);
      }

      // Upsert (cria ou atualiza) a ficha de treino
      console.log('Salvando no banco de dados...');
      const workoutPlan = await prisma.workoutPlan.upsert({
        where: { studentId: student.personId }, // Usar personId do student
        update: {
          content,
          employeeId: teacherPersonId, // Usar personId do teacher
        },
        create: {
          content,
          studentId: student.personId, // Usar personId do student
          employeeId: teacherPersonId, // Usar personId do teacher
        },
      });

      console.log('Workout plan salvo com sucesso:', workoutPlan.id);
      response.status(200).json(workoutPlan);
    } catch (error) {
      console.error('Erro no createOrUpdate:', error);
      if (error instanceof z.ZodError) {
        console.error('Zod validation errors:', error.errors);
        throw new AppError('Formato da ficha de treino inválido: ' + error.errors.map(e => e.message).join(', '), 400);
      }
      throw error;
    }
  }

  public async get(request: Request, response: Response): Promise<void> {
    const { studentId } = request.params;

    try {
      // Primeiro buscar o student para obter o personId
      const student = await prisma.student.findUnique({
        where: { id: Number(studentId) },
      });

      if (!student) {
        throw new AppError('Aluno não encontrado', 404);
      }

      const workoutPlan = await prisma.workoutPlan.findUnique({
        where: { studentId: student.personId }, // Usar personId do student
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
