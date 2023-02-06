/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@sreeteja06/nest-core';
import { storage, Store } from 'nestjs-pino/storage';
import { pinoHttp } from 'pino-http';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;

  app.use((req, res, next) => {
    console.log('Request received');
    // @ts-ignore
    storage.run(() => {
      // @ts-ignore
      new Store('hello');
    }, next);
  });

  await app.listen(port);

  NestLogger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
