import { HashService } from '@common/hash/hash.service';
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const emojiLevel = {
  ERROR: '❗',
  WARN: '⚠️',
  INFO: '💬',
  HTTP: '🌐',
  VERBOSE: '📢',
  DEBUG: '🪲',
  GRAPHQL: '🛰️',
};

const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '');

const customFormat = printf(
  ({
    level,
    message,
    timestamp,
    stack,
  }: {
    level: string;
    message: string;
    timestamp: string;
    stack?: string;
  }) => {
    const cleanLevel = stripAnsi(level).toUpperCase();

    const emoji = (emojiLevel as Record<string, string>)[cleanLevel];

    return `${timestamp} ${emoji || ''} [${level}]: ${stack || message}`;
  },
);

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;
  private readonly hashService: HashService;
  
  constructor() {
    this.logger = winston.createLogger({
      level: 'debug',
      format: combine(
        splat(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss', alias: 'time' }),
        colorize({
          level: true,
          colors: {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            http: 'blue',
            verbose: 'cyan',
            debug: 'magenta',
            silly: 'gray',
          },
          message: true,
        }),
        errors({ stack: true }),
        customFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log', level: 'info' }),
        new winston.transports.File({ filename: 'debug.log', level: 'debug' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, error?: Error) {
    this.logger.error(message, error ? error.stack : undefined);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  // TODO Create a service for encrypt data, this is different from hasshing because the hashing only works one way, encryption can be reversed
  // encrypt(message: string, sensitiveData: string) {
  //   const encryptedData = this.hashService.encrypt(sensitiveData);
  //   this.logger.info(`${message}: ${sensitiveData}`);
  // }

  silly(message: string) {
    this.logger.silly(message);
  }

  http(message: string) {
    this.logger.http(message);
  }

  graphql(operationName: string, query: string, variables: string) {
    this.logger.http(`GraphQL: ${operationName} - ${query} - ${variables}`);
  }
}
