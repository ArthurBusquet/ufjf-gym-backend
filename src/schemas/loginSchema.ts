import { z } from 'zod';

export const loginSchema = {
  login: z.object({
    body: z.object({
      email: z
        .string({
          required_error: 'O campo e-mail é obrigatório',
        })
        .trim()
        .min(1, 'O campo nome é obrigatório.')
        .email('Formato inválido para e-mail'),
      password: z
        .string({
          required_error: 'O campo senha é obrigatório',
        })
        .trim(),
    }),
  }),
};
