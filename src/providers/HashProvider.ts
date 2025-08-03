import { hash, compare } from 'bcrypt';

export class HashProvider {
  async generateHash(payload: string): Promise<string> {
    return await hash(payload, 8);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed);
  }
}
