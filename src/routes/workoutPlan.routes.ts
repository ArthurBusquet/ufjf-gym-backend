import { Router } from 'express';
import { workoutPlanController } from '@controllers/WorkoutPlanController';
import { validate } from '@middlewares/validateMiddleware';
import { workoutPlanSchema } from '@schemas/workoutPlanSchema';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticationMiddleware';
import { checkRole } from '@middlewares/checkRoleMiddleware';

const workoutPlanRoutes = Router();

// Rota para criar/atualizar ficha de treino
workoutPlanRoutes.put(
  '/students/:studentId/workout-plans',
  ensureAuthenticated,
  checkRole(['TEACHER', 'ADMIN']),
  validate(workoutPlanSchema.createUpdate),
  workoutPlanController.createOrUpdate.bind(workoutPlanController)
);

// Rota para obter ficha de treino
workoutPlanRoutes.get(
  '/students/:studentId/workout-plans',
  ensureAuthenticated,
  workoutPlanController.get.bind(workoutPlanController)
);

export { workoutPlanRoutes };
