import { type Request, type Response, type NextFunction } from 'express';
import { type AnyZodObject, type ZodError } from 'zod';

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('teste', req.params);
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      const error = err as ZodError;
      return res
        .status(400)
        .json({ message: 'Dados inválidos', fields: error.issues });
    }
  };
