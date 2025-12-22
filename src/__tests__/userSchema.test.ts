import { userSchema } from '../schemas/userSchema';

describe('User Schema Validation', () => {
  describe('userSchema.create', () => {
    it('should accept valid employee data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        password: '123456',
        role: 'TEACHER',
        tenure: 2,
      };

      const result = userSchema.create.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid student data with membership', () => {
      const validData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        cpf: '98765432109',
        password: '654321',
        isStudent: true,
        membership: {
          type: 'MONTHLY',
          startDate: '2024-01-01T00:00:00.000Z',
          status: 'ACTIVE',
        },
      };

      const result = userSchema.create.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: '123456',
      };

      const result = userSchema.create.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject name shorter than 3 characters', () => {
      const invalidData = {
        name: 'Jo',
        email: 'john@example.com',
        password: '123456',
      };

      const result = userSchema.create.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'INVALID_ROLE',
      };

      const result = userSchema.create.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept all valid roles', () => {
      const roles = ['ADMIN', 'RECEPTIONIST', 'TEACHER', 'TRAINEE'];
      
      roles.forEach((role) => {
        const result = userSchema.create.safeParse({ role });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid membership types', () => {
      const types = ['MONTHLY', 'QUARTERLY', 'SEMESTERLY', 'ANNUAL'];
      
      types.forEach((type) => {
        const data = {
          membership: {
            type,
            startDate: '2024-01-01T00:00:00.000Z',
          },
        };
        const result = userSchema.create.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('userSchema.update', () => {
    it('should accept partial update', () => {
      const updateData = {
        name: 'Updated Name',
      };

      const result = userSchema.update.safeParse(updateData);
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const result = userSchema.update.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('userSchema.updatePassword', () => {
    it('should reject password shorter than 6 characters', () => {
      const invalidData = {
        password: '12345',
      };

      const result = userSchema.updatePassword.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept password with 6 or more characters', () => {
      const validData = {
        password: '123456',
      };

      const result = userSchema.updatePassword.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
