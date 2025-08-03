/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { prisma } from '../prisma.client';
import type { MembershipType } from '@prisma/client';

class MembershipService {
  public async createActiveMembership(
    studentId: number,
    data: {
      type: MembershipType;
      startDate: Date;
    }
  ) {
    return await prisma.$transaction(async (tx) => {
      // Inativar matrículas ativas existentes
      await tx.membership.updateMany({
        where: {
          studentId,
          status: 'ACTIVE',
        },
        data: {
          status: 'CANCELLED',
          endDate: new Date(),
        },
      });

      // Criar nova matrícula ativa
      return await tx.membership.create({
        data: {
          ...data,
          studentId,
          status: 'ACTIVE',
        },
      });
    });
  }
}

export const membershipService = new MembershipService();
