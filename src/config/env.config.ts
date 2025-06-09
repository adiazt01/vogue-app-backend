import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  MONGO_URL: string;
  JWT_SECRET: string;
  SALT_ROUNDS: number;
  JWT_EXPIRATION: string;
  NODE_ENV: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().uri().required(),
    JWT_SECRET: joi.string().min(10).required(),
    SALT_ROUNDS: joi.number().integer().min(1).required(),
    JWT_EXPIRATION: joi.string().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
  })
  .unknown(true);

const result = envsSchema.validate(
  {
    ...process.env,
  },
  {
    abortEarly: true,
  },
);

const error = result.error;

if (error) {
  console.error('Environment variables validation error:', error.details);
  process.exit(1);
}

export const envs: Envs = result.value as Envs;
