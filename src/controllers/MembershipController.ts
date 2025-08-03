// membership.controller.ts
import type { Request, Response } from 'express';
import { membershipService } from '@services/MembershipService';
import { AppError } from '@errors/AppError';

export class MembershipController {
  public async create(request: Request, response: Response): Promise<void> {
    const { studentId } = request.params;
    const { type, startDate } = request.body;

    try {
      const membership = await membershipService.createActiveMembership(
        Number(studentId),
        {
          type,
          startDate: new Date(startDate),
        }
      );

      response.status(201).json(membership);
    } catch (error) {
      throw new AppError('Falha ao criar matrícula', 500);
    }
  }
}

export const membershipController = new MembershipController();
