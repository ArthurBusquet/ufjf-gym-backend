import { z } from 'zod';

// Enums para validação
const EmployeeRole = z.enum(['ADMIN', 'RECEPTIONIST', 'TEACHER', 'TRAINEE']);
const MembershipType = z.enum(['MONTHLY', 'QUARTERLY', 'SEMESTERLY', 'ANNUAL']);
const MembershipStatus = z.enum(['ACTIVE', 'CANCELLED', 'SUSPENDED']);

export const userSchema = {
  create: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    cpf: z.string().min(11).max(14).optional(),
    password: z.string().min(6).optional(),
    role: EmployeeRole.optional(),
    tenure: z.coerce.number().min(0).optional(),
    isStudent: z.boolean().optional(),
    membership: z
      .object({
        type: MembershipType,
        startDate: z.string().datetime(),
      })
      .optional(),
  }),

  update: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    cpf: z.string().min(11).max(14).optional(),
    role: EmployeeRole.optional(),
    tenure: z.number().min(0).optional(),
    isStudent: z.boolean().optional(),
  }),

  updateProfile: z.object({
    name: z.string().min(3).optional(),
  }),

  updatePassword: z.object({
    password: z.string().min(6),
  }),

  updateProfilePassword: z.object({
    password: z.string().min(6),
  }),

  membership: z.object({
    type: MembershipType,
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    status: MembershipStatus,
  }),
};
