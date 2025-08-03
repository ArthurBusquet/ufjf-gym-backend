import { Router } from 'express';

import { usersRoutes } from './user.routes';
import { authRoutes } from './auth.routes';
import { workoutPlanRoutes } from './workoutPlan.routes';
import { physicalAssessmentRoutes } from './physicalAssessment.routes';
import { membershipRoutes } from './membership.routes';

const router = Router();

router.use('/api/users', usersRoutes);
router.use('/api/sessions', authRoutes);
router.use('/api/workout-plan', workoutPlanRoutes);
router.use('/api/physical-assessment', physicalAssessmentRoutes);
router.use('/api/membership', membershipRoutes);

export { router };
