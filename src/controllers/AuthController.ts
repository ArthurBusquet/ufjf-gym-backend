import { type Request, type Response } from 'express';
import { sign } from 'jsonwebtoken';

import { authConfig } from '@config/auth';
import { AppError } from '@errors/AppError';
import { prisma } from '../prisma.client';
import { HashProvider } from '@providers/HashProvider';

export class AuthController {
  private readonly hashProvider = new HashProvider();

  public async login(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    console.log('Login attempt:', { email, password });

    // Buscar pessoa com suas especializações
    const person = await prisma.person.findUnique({
      where: { email },
      include: {
        employee: true,
        student: true,
      },
    });

    if (!person) {
      throw new AppError('E-mail ou senha inválidos', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      person.password
    );

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha inválidos', 401);
    }

    const { secret, expiration } = authConfig.options.jwt;

    // Determinar os papéis do usuário
    const roles: string[] = [];

    if (person.employee) {
      roles.push(person.employee.role);
    }

    if (person.student) {
      roles.push('STUDENT');
    }

    // Formatar dados do usuário para o token
    const formatedUser = {
      id: person.id,
      name: person.name,
      email: person.email,
      roles,
      avatar: person.avatar,
      cpf: person.cpf,
      tenure: person.employee?.tenure,
      studentId: person.student?.id,
      employeeId: person.employee?.id,
    };

    const token = sign(formatedUser, secret, {
      expiresIn: expiration,
    });

    response.json({ user: formatedUser, token });
  }
}
