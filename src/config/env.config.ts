import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  MONGO_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SALT_ROUNDS: number;
  JWT_EXPIRATION: string;
  JWT_EXPIRATION_REFRESH: string;
  OTP_EXPIRATION_MINUTES: number;
  NODE_ENV: string;
  STRIPE_SECRET_KEY: string;
  FRONTEND_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().uri().required(),
    JWT_SECRET: joi.string().min(10).required(),
    JWT_REFRESH_SECRET: joi.string().min(10).required(),
    SALT_ROUNDS: joi.number().integer().min(1).required(),
    JWT_EXPIRATION: joi.string().required(),
    JWT_EXPIRATION_REFRESH: joi.string().required(),
    OTP_EXPIRATION_MINUTES: joi.number().integer().required(),
    NODE_ENV: joi
      .string()
      .valid('development', 'production', 'test')
      .required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    FRONTEND_URL: joi.string().uri().required(),
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
