import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { envs } from 'src/config/env.config';

@Injectable()
export class HashService {
  private readonly saltRounds: number = Number(envs.SALT_ROUNDS);

  async hash(data: string): Promise<string> {
    try {
      return await bcrypt.hash(data, this.saltRounds);
    } catch (error) {
      console.error('Hashing error:', error);
      throw new Error('Hashing failed: Unknown error');
    }
  }

  

  async compare(input: string, inputHashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(input, inputHashed);
    } catch (error) {
      console.error('Comparison error:', error);
      throw new Error('Comparison failed: Unknown error');
    }
  }
}
