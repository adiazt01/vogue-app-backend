import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { envs } from 'src/config/env.config';

@Injectable()
export class HashService {
  private readonly saltRounds: number = Number(envs.SALT_ROUNDS);

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error('Hashing failed: Unknown error');
    }
  }

  async compare(input: string, inputHashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(input, inputHashed);
    } catch (error) {
      throw new Error('Comparison failed: Unknown error');
    }
  }
}
