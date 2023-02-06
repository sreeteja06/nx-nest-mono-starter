import { NestFactory } from '@nestjs/core';
import { appBootstrap } from '@sreeteja06/nest-core';
import helmet from 'helmet';
import project from '../project.json';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());

  app.enableCors({
    origin: '*',
  });

  appBootstrap(app, project.name);
}

bootstrap();
