import { z } from 'zod';

export const physicalAssessmentSchema = {
  createUpdate: z.object({
    height: z.number().positive().optional(),
    weight: z.number().positive().optional(),
    bodyFat: z.number().positive().optional(),
    observations: z.string().optional(),
  }),
};
