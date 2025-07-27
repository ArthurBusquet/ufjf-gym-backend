import { Router } from 'express';

import { usersRoutes } from './user.routes';
import { authRoutes } from './auth.routes';
import { challengeRoutes } from './challenge.routes';

const router = Router();

router.use('/api/users', usersRoutes);
router.use('/api/challenges', challengeRoutes);
router.use('/api/sessions', authRoutes);

export { router };
