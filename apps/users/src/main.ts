import { NestFactory } from '@nestjs/core';
import { appBootstrap } from '@sreeteja06/nest-core';
import project from '../project.json';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  appBootstrap(app, project.name);
}

bootstrap();
