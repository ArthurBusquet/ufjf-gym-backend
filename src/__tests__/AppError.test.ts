import { AppError } from '../errors/AppError';

describe('AppError', () => {
  it('should create an error with message and default status code', () => {
    const error = new AppError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
  });

  it('should create an error with custom status code', () => {
    const error = new AppError('Not found', 404);

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it('should handle unauthorized error', () => {
    const error = new AppError('Unauthorized', 401);

    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });

  it('should handle internal server error', () => {
    const error = new AppError('Internal server error', 500);

    expect(error.statusCode).toBe(500);
  });

  it('should preserve stack trace', () => {
    const error = new AppError('Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('AppError');
  });
});
