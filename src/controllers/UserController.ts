import { type Request, type Response } from 'express';
import { EmployeeRole, MembershipStatus } from '@prisma/client';
import { prisma } from '../prisma.client';
import { S3StorageProvider } from '@providers/S3StorageProvider';
import { HashProvider } from '@providers/HashProvider';
import { AppError } from '@errors/AppError';

export class UserController {
  private readonly hashProvider = new HashProvider();
  private readonly storageProvider = new S3StorageProvider();

  public async index(_: Request, response: Response): Promise<void> {
    const persons = await prisma.person.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        employee: {
          select: {
            role: true,
            tenure: true,
          },
        },
        student: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Formatar resposta incluindo roles
    const users = persons.map((person) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      avatar: person.avatar,
      roles: [
        ...(person.employee ? [person.employee.role] : []),
        ...(person.student ? ['STUDENT'] : []),
      ],
      tenure: person.employee?.tenure,
    }));

    response.status(200).json(users);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const person = await prisma.person.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        employee: {
          select: {
            role: true,
            tenure: true,
            id: true,
          },
        },
        student: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!person) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Formatar resposta incluindo roles
    const user = {
      id: person.id,
      name: person.name,
      email: person.email,
      avatar: person.avatar,
      roles: [
        ...(person.employee ? [person.employee.role] : []),
        ...(person.student ? ['STUDENT'] : []),
      ],
      tenure: person.employee?.tenure,
    };

    response.status(200).json(user);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const userId = request.params.id;

    const { name, email, role, tenure, isStudent } = request.body;

    try {
      // Atualizar foto se fornecida
      if (request.file) {
        const person = await prisma.person.findUnique({
          where: { id: Number(userId) },
        });

        if (person?.avatar) {
          await this.storageProvider.delete(person.avatar);
        }

        const avatarUrl = await this.storageProvider.upload(request.file);

        await prisma.person.update({
          where: { id: Number(userId) },
          data: { avatar: avatarUrl },
        });
      }

      // Atualizar dados básicos
      await prisma.person.update({
        where: { id: Number(userId) },
        data: { name, email },
      });

      // Gerenciar especialização Employee
      if (role) {
        const existingEmployee = await prisma.employee.findUnique({
          where: { personId: Number(userId) },
        });

        if (existingEmployee) {
          await prisma.employee.update({
            where: { personId: Number(userId) },
            data: {
              role: role as EmployeeRole,
              tenure: tenure ? parseInt(tenure) : undefined,
            },
          });
        } else {
          await prisma.employee.create({
            data: {
              role: role as EmployeeRole,
              tenure: tenure ? parseInt(tenure) : 0,
              person: { connect: { id: Number(userId) } },
            },
          });
        }
      }

      // Gerenciar especialização Student
      if (isStudent) {
        const existingStudent = await prisma.student.findUnique({
          where: { personId: Number(userId) },
        });

        if (!existingStudent) {
          await prisma.student.create({
            data: {
              person: { connect: { id: Number(userId) } },
            },
          });
        }
      }

      const updatedUser = await prisma.person.findUnique({
        where: { id: Number(userId) },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          employee: {
            select: {
              role: true,
              tenure: true,
            },
          },
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      response.json({
        id: updatedUser?.id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        avatar: updatedUser?.avatar,
        roles: [
          ...(updatedUser?.employee ? [updatedUser.employee.role] : []),
          ...(updatedUser?.student ? ['STUDENT'] : []),
        ],
        tenure: updatedUser?.employee?.tenure,
      });
    } catch (error) {
      throw new AppError('Falha ao atualizar usuário', 500);
    }
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, email, cpf, password, role, tenure, isStudent } =
      request.body;
    const currentUser = request.user;

    try {
      // Verificar se está tentando criar funcionário
      if (role) {
        if (!currentUser?.roles.includes('ADMIN')) {
          throw new AppError(
            'Apenas administradores podem criar funcionários',
            403
          );
        }
      }

      // Verificar se está tentando criar aluno
      if (isStudent) {
        if (
          !currentUser?.roles.includes('ADMIN') &&
          !currentUser?.roles.includes('RECEPTIONIST')
        ) {
          throw new AppError(
            'Apenas administradores e recepcionistas podem criar alunos',
            403
          );
        }
      }

      const passwordHash = await this.hashProvider.generateHash(
        password || '654321'
      );

      // Criar pessoa
      const person = await prisma.person.create({
        data: {
          name,
          email,
          cpf,
          password: passwordHash,
          avatar: '',
        },
      });

      // Criar funcionário se especificado
      if (role) {
        await prisma.employee.create({
          data: {
            role: role as EmployeeRole,
            tenure: tenure ? parseInt(tenure) : 0,
            person: { connect: { id: person.id } },
          },
        });
      }

      // Criar aluno se especificado
      if (isStudent) {
        await prisma.student.create({
          data: {
            person: { connect: { id: person.id } },
          },
        });
      }

      // Atualizar foto se fornecida
      if (request.file) {
        const avatarUrl = await this.storageProvider.upload(request.file);
        await prisma.person.update({
          where: { id: person.id },
          data: { avatar: avatarUrl },
        });
      }

      response.status(201).json({
        message: 'Usuário registrado com sucesso',
        userId: person.id,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Usuário já cadastrado', 400);
      } else if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError('Falha ao criar usuário', 500);
      }
    }
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    try {
      // Remover especializações primeiro
      await prisma.employee.deleteMany({ where: { personId: Number(id) } });
      await prisma.student.deleteMany({ where: { personId: Number(id) } });

      // Remover pessoa
      await prisma.person.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      throw new AppError('Usuário não encontrado', 404);
    }

    response.status(200).send();
  }

  public async passwordReset(
    request: Request,
    response: Response
  ): Promise<void> {
    const { id } = request.params;

    const passwordHash = await this.hashProvider.generateHash('654321');

    try {
      await prisma.person.update({
        where: { id: Number(id) },
        data: { password: passwordHash },
      });
    } catch (error) {
      throw new AppError('Usuário não encontrado', 404);
    }

    response.status(200).send();
  }

  public async showProfile(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = request.user.id;

    const person = await prisma.person.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        employee: {
          select: {
            id: true,
            personId: true,
            role: true,
          },
        },
        student: {
          select: {
            id: true,
            personId: true,
          },
        },
      },
    });

    if (!person) {
      response.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    response.json({
      id: person.id,
      name: person.name,
      email: person.email,
      avatar: person.avatar,
      roles: [
        ...(person.employee ? [person.employee.role] : []),
        ...(person.student ? ['STUDENT'] : []),
      ],
    });
  }

  public async updateProfile(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = request.user.id;

    const { name } = request.body;

    try {
      if (request.file) {
        const person = await prisma.person.findUnique({
          where: { id: Number(userId) },
        });

        if (person?.avatar) {
          await this.storageProvider.delete(person.avatar);
        }

        const avatarUrl = await this.storageProvider.upload(request.file);

        await prisma.person.update({
          where: { id: Number(userId) },
          data: { avatar: avatarUrl },
        });
      }

      const updatedPerson = await prisma.person.update({
        where: { id: Number(userId) },
        data: { name },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          employee: {
            select: {
              role: true,
            },
          },
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      response.json({
        name: updatedPerson.name,
        email: updatedPerson.email,
        avatar: updatedPerson.avatar,
        roles: [
          ...(updatedPerson.employee ? [updatedPerson.employee.role] : []),
          ...(updatedPerson.student ? ['STUDENT'] : []),
        ],
      });
    } catch (error) {
      throw new AppError('Falha ao atualizar perfil', 500);
    }
  }

  public async updateProfilePassword(
    request: Request,
    response: Response
  ): Promise<void> {
    const userId = request.user.id;

    const { password } = request.body;

    const passwordHash = await this.hashProvider.generateHash(password);

    try {
      await prisma.person.update({
        where: { id: Number(userId) },
        data: { password: passwordHash },
      });

      response.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      throw new AppError('Falha ao atualizar senha', 500);
    }
  }

  public async listStudents(
    request: Request,
    response: Response
  ): Promise<void> {
    try {
      // Buscar todos os alunos com suas informações básicas e matrícula ativa
      const students = await prisma.student.findMany({
        include: {
          person: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              cpf: true,
              createdAt: true,
            },
          },
          memberships: {
            where: {
              status: 'ACTIVE',
            },
            orderBy: {
              startDate: 'desc', // Ordena para pegar a mais recente
            },
            take: 1, // Pega apenas a matrícula ativa mais recente
          },
        },
      });

      // Formatar resposta incluindo data da matrícula ativa
      const formattedStudents = students.map((student) => ({
        id: student.person.id,
        personId: student.person.id,
        name: student.person.name,
        email: student.person.email,
        photo: student.person.avatar,
        cpf: student.person.cpf,
        createdAt: student.person.createdAt,
        activeMembership:
          student.memberships.length > 0
            ? {
                startDate: student.memberships[0].startDate,
                type: student.memberships[0].type,
              }
            : null,
      }));

      response.status(200).json(formattedStudents);
    } catch (error) {
      throw new AppError('Falha ao listar alunos', 500);
    }
  }

  public async listEmployees(
    request: Request,
    response: Response
  ): Promise<void> {
    console.log('Listando funcionários...');
    try {
      // Buscar todos os funcionários com suas informações
      const employees = await prisma.employee.findMany({
        include: {
          person: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              cpf: true,
            },
          },
        },
      });

      // Formatar resposta
      const formattedEmployees = employees.map((employee) => ({
        id: employee.person.id,
        personId: employee.person.id,
        name: employee.person.name,
        email: employee.person.email,
        photo: employee.person.avatar,
        cpf: employee.person.cpf,
        role: employee.role,
        tenure: employee.tenure,
      }));

      response.status(200).json(formattedEmployees);
    } catch (error) {
      console.log('AAAAAAAAAAA');
      throw new AppError('Falha ao listar funcionários', 500);
    }
  }
}
