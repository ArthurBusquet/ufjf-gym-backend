import { PrismaClient } from '@prisma/client';
import type { Person } from '@prisma/client';

export const prisma = new PrismaClient().$extends({
  result: {
    person: {
      avatarUrl: {
        needs: { avatar: true },
        compute(person: Person) {
          return person.avatar !== null && person.avatar !== ''
            ? `${process.env.STORAGE_LOCATION}/${person.avatar}`
            : null;
        },
      },
    },
  },
});
