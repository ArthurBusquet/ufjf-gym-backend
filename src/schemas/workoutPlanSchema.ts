import { z } from 'zod';

// Definindo o schema baseado na estrutura fornecida
const exerciseSchema = z.object({
  nome: z.string().optional(),
  series: z.string().optional(),
  repeticoes: z.string().optional(),
  carga: z.string().optional(),
  descanso: z.string().optional(),
});

const groupSchema = z.object({
  nome: z.string().optional(),
  exercicios: z.array(exerciseSchema).optional(),
});

export const workoutPlanSchema = {
  createUpdate: z.object({
    nome: z.string().optional(),
    objetivo: z.string().optional(),
    validoAte: z.string().optional(),
    observacoes: z.string().optional(),
    grupos: z.array(groupSchema).optional(),
  }),
};
