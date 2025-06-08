import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/env.config';
import { setupSwagger } from './config/swagger.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log(`Starting application in ${envs.NODE_ENV} mode...`);
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  logger.log(`Application is running on: http://localhost:${envs.PORT}`);
  logger.log(
    `API documentation available at: http://localhost:${envs.PORT}/api`,
  );
  await app.listen(envs.PORT);
}
bootstrap();
