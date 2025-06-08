import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  MONGO_URL: string;
  JWT_SECRET: string;
  SALT_ROUNDS: number;
  JWT_EXPIRATION: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().uri().required(),
    JWT_SECRET: joi.string().min(10).required(),
    SALT_ROUNDS: joi.number().integer().min(1).required(),
    JWT_EXPIRATION: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
});

if (error) {
  console.error('Environment variables validation error:', error.details);
  process.exit(1);
}

const envsValidates: Envs = value as Envs;

export const envs = {
  PORT: envsValidates.PORT,
  MONGO_URL: envsValidates.MONGO_URL,
  JWT_SECRET: envsValidates.JWT_SECRET,
  SALT_ROUNDS: envsValidates.SALT_ROUNDS,
  JWT_EXPIRATION: envsValidates.JWT_EXPIRATION,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
