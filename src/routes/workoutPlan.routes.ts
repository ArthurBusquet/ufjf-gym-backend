import { Router } from 'express';
import { workoutPlanController } from '@controllers/WorkoutPlanController';

import { ensureAuthenticated } from '@middlewares/ensureAuthenticationMiddleware';
import { checkRole } from '@middlewares/checkRoleMiddleware';

const workoutPlanRoutes = Router();

// Rota para criar/atualizar ficha de treino
workoutPlanRoutes.put(
  '/students/:studentId/workout-plans',
  ensureAuthenticated,
  checkRole(['TEACHER', 'ADMIN']),
  workoutPlanController.createOrUpdate.bind(workoutPlanController)
);

// Rota para obter ficha de treino
workoutPlanRoutes.get(
  '/students/:studentId/workout-plans',
  ensureAuthenticated,
  workoutPlanController.get.bind(workoutPlanController)
);

export { workoutPlanRoutes };
