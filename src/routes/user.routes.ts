import { Router } from 'express';
import multer from 'multer';

import { UserController as UserControllerClass } from '@controllers/UserController';
import { validate } from '@middlewares/validateMiddleware';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticationMiddleware';
import { userSchema } from '@schemas/userSchema';
import { imageFilter } from '../utils/upload';
import { checkRole } from '@middlewares/checkRoleMiddleware';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 1048576 * 5 },
  fileFilter: imageFilter,
});

const usersRoutes = Router();

export const UserController = new UserControllerClass();

// Rotas autenticadas para perfil do usuário
usersRoutes.get('/profile', ensureAuthenticated, UserController.showProfile);

// Rota específica para perfil completo do aluno
usersRoutes.get('/students/profile', ensureAuthenticated, UserController.getStudentProfile.bind(UserController));

usersRoutes.put(
  '/profile',
  upload.single('avatar'),
  ensureAuthenticated,
  validate(userSchema.updateProfile),
  UserController.updateProfile.bind(UserController)
);

usersRoutes.patch(
  '/profile/password',
  ensureAuthenticated,
  validate(userSchema.updatePassword),
  UserController.updateProfilePassword.bind(UserController)
);

usersRoutes.post(
  '/create',
  ensureAuthenticated,
  upload.single('avatar'),
  validate(userSchema.create),
  UserController.create.bind(UserController)
);

// Rotas administrativas (apenas admin)
usersRoutes.get(
  '/',
  ensureAuthenticated,
  checkRole(['ADMIN']),
  UserController.index.bind(UserController)
);

usersRoutes.get(
  '/students',
  ensureAuthenticated,
  checkRole(['ADMIN', 'RECEPTIONIST', 'TEACHER', 'TRAINEE']),
  UserController.listStudents.bind(UserController)
);

usersRoutes.get(
  '/employees',
  ensureAuthenticated,
  checkRole(['ADMIN']),
  UserController.listEmployees.bind(UserController)
);

usersRoutes.get(
  '/:id',
  ensureAuthenticated,
  checkRole(['ADMIN']),
  UserController.show.bind(UserController)
);

usersRoutes.put(
  '/:id',
  upload.single('avatar'),
  ensureAuthenticated,
  checkRole(['ADMIN']),
  validate(userSchema.update),
  UserController.update.bind(UserController)
);

usersRoutes.delete(
  '/:id',
  ensureAuthenticated,
  checkRole(['ADMIN']),
  UserController.delete.bind(UserController)
);

usersRoutes.patch(
  '/:id/reset-password',
  ensureAuthenticated,
  checkRole(['ADMIN']),
  UserController.passwordReset.bind(UserController)
);

export { usersRoutes };
