import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/env.config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log(`Starting application in ${envs.NODE_ENV} mode...`);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  logger.log(`Application is running on: http://localhost:${envs.PORT}`);
  logger.log(`GraphQL endpoint: http://localhost:${envs.PORT}/graphql`);

  await app.listen(envs.PORT);
}
bootstrap();
