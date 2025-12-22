import { HashProvider } from '../providers/HashProvider';

describe('HashProvider', () => {
  let hashProvider: HashProvider;

  beforeEach(() => {
    hashProvider = new HashProvider();
  });

  describe('generateHash', () => {
    it('should generate a hash from a password', async () => {
      const password = '123456';
      const hash = await hashProvider.generateHash(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
    });

    it('should generate different hashes for the same password', async () => {
      const password = '123456';
      const hash1 = await hashProvider.generateHash(password);
      const hash2 = await hashProvider.generateHash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should generate a bcrypt formatted hash', async () => {
      const password = 'testpassword';
      const hash = await hashProvider.generateHash(password);

      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    });
  });

  describe('compareHash', () => {
    it('should return true when password matches hash', async () => {
      const password = '123456';
      const hash = await hashProvider.generateHash(password);
      const isMatch = await hashProvider.compareHash(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should return false when password does not match hash', async () => {
      const password = '123456';
      const wrongPassword = 'wrongpassword';
      const hash = await hashProvider.generateHash(password);
      const isMatch = await hashProvider.compareHash(wrongPassword, hash);

      expect(isMatch).toBe(false);
    });

    it('should distinguish between similar passwords', async () => {
      const password1 = '123456';
      const password2 = '1234567';
      const hash = await hashProvider.generateHash(password1);

      const match1 = await hashProvider.compareHash(password1, hash);
      const match2 = await hashProvider.compareHash(password2, hash);

      expect(match1).toBe(true);
      expect(match2).toBe(false);
    });
  });
});
