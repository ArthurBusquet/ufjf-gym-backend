import { Router } from 'express';
import { membershipController } from '@controllers/MembershipController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticationMiddleware';
import { checkRole } from '@middlewares/checkRoleMiddleware';

const membershipRoutes = Router();

// Criar nova matrícula
membershipRoutes.post(
  '/students/:studentId/memberships',
  ensureAuthenticated,
  checkRole(['RECEPTIONIST', 'ADMIN']),
  membershipController.create.bind(membershipController)
);

export { membershipRoutes }; 