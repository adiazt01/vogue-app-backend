import { Module } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { LoggerService } from './logger/logger.service';

@Module({
  providers: [HashService, LoggerService],
  exports: [HashService, LoggerService],
})
export class CommonModule {}
