import { loginSchema } from '../schemas/loginSchema';

describe('Login Schema Validation', () => {
  describe('Valid inputs', () => {
    it('should accept valid email and password', () => {
      const validData = {
        body: {
          email: 'user@example.com',
          password: '123456',
        },
      };

      const result = loginSchema.login.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept email with subdomain', () => {
      const validData = {
        body: {
          email: 'user@mail.example.com',
          password: 'password123',
        },
      };

      const result = loginSchema.login.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid inputs', () => {
    it('should reject invalid email format', () => {
      const invalidData = {
        body: {
          email: 'invalid-email',
          password: '123456',
        },
      };

      const result = loginSchema.login.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const invalidData = {
        body: {
          email: '',
          password: '123456',
        },
      };

      const result = loginSchema.login.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const invalidData = {
        body: {
          password: '123456',
        },
      };

      const result = loginSchema.login.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        body: {
          email: 'user@example.com',
        },
      };

      const result = loginSchema.login.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should trim whitespace from email', () => {
      const dataWithWhitespace = {
        body: {
          email: '  user@example.com  ',
          password: '123456',
        },
      };

      const result = loginSchema.login.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.email).toBe('user@example.com');
      }
    });
  });
});
