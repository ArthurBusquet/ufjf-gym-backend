import { DayjsDateProvider } from '../providers/DayJsProvider';

describe('DayjsDateProvider', () => {
  let dateProvider: DayjsDateProvider;

  beforeEach(() => {
    dateProvider = new DayjsDateProvider();
  });

  describe('dateNow', () => {
    it('should return current date', () => {
      const now = dateProvider.dateNow();
      const expected = new Date();

      expect(Math.abs(now.getTime() - expected.getTime())).toBeLessThan(1000);
    });
  });

  describe('compareIfBefore', () => {
    it('should return true when start_date is before end_date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const result = dateProvider.compareIfBefore(startDate, endDate);
      expect(result).toBe(true);
    });

    it('should return false when start_date is after end_date', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      const result = dateProvider.compareIfBefore(startDate, endDate);
      expect(result).toBe(false);
    });

    it('should return false when dates are equal', () => {
      const sameDate = new Date('2024-06-15');

      const result = dateProvider.compareIfBefore(sameDate, sameDate);
      expect(result).toBe(false);
    });
  });

  describe('compareIfAfter', () => {
    it('should return true when start_date is after end_date', () => {
      const startDate = new Date('2024-12-31');
      const endDate = new Date('2024-01-01');

      const result = dateProvider.compareIfAfter(startDate, endDate);
      expect(result).toBe(true);
    });

    it('should return false when start_date is before end_date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const result = dateProvider.compareIfAfter(startDate, endDate);
      expect(result).toBe(false);
    });
  });

  describe('compareInDays', () => {
    it('should calculate difference in days correctly', () => {
      const startDate = new Date('2024-01-10');
      const endDate = new Date('2024-01-01');

      const result = dateProvider.compareInDays(startDate, endDate);
      expect(result).toBe(9);
    });

    it('should return negative value when start is before end', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-10');

      const result = dateProvider.compareInDays(startDate, endDate);
      expect(result).toBe(-9);
    });
  });

  describe('addDays', () => {
    it('should add days to current date', () => {
      const now = new Date();
      const result = dateProvider.addDays(5);
      const expected = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(
        1000
      );
    });
  });

  describe('addHours', () => {
    it('should add hours to current date', () => {
      const now = new Date();
      const result = dateProvider.addHours(2);
      const expected = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      expect(Math.abs(result.getTime() - expected.getTime())).toBeLessThan(
        1000
      );
    });
  });
});
