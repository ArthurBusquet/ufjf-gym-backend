import { Router } from 'express';
import { physicalAssessmentController } from '@controllers/PhysicalAssessmentController';
import { validate } from '@middlewares/validateMiddleware';
import { physicalAssessmentSchema } from '@schemas/physicalAssessmentSchema';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticationMiddleware';
import { checkRole } from '@middlewares/checkRoleMiddleware';

const physicalAssessmentRoutes = Router();

// Criar ou atualizar avaliação física
physicalAssessmentRoutes.post(
  '/students/:studentId/assessments',
  ensureAuthenticated,
  checkRole(['TEACHER', 'ADMIN']),
  validate(physicalAssessmentSchema.createUpdate),
  physicalAssessmentController.create.bind(physicalAssessmentController)
);

// Atualizar avaliação EXISTENTE
physicalAssessmentRoutes.put(
  '/assessments/:assessmentId',
  ensureAuthenticated,
  checkRole(['TEACHER', 'ADMIN']),
  validate(physicalAssessmentSchema.createUpdate),
  physicalAssessmentController.update.bind(physicalAssessmentController)
);

export { physicalAssessmentRoutes };
