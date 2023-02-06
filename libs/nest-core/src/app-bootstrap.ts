import { IConfigService } from './config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
  Logger as NestLogger,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { CaptureConsole } from '@sentry/integrations';
import { Logger } from 'nestjs-pino';
import { ErrorFilter } from './filters/error.filter';
import expressBasicAuth = require('express-basic-auth');

export const appBootstrap = async (app: INestApplication, appName: string) => {
  const configService = app.get(IConfigService);

  app.useLogger(app.get(Logger));

  const globalPrefix = 'api';

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new ErrorFilter(configService));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger Configuration
  if (configService.SWAGGER?.USERNAME && configService.SWAGGER?.PASSWORD) {
    app.use(
      ['/api-docs', '/api-docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [configService.SWAGGER?.USERNAME || '']:
            configService.SWAGGER?.PASSWORD || '',
        },
      })
    );

    const options = new DocumentBuilder()
      .setTitle(appName)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document);
  }

  if (configService.SENTRY?.ENABLED) {
    Sentry.init({
      dsn: configService.SENTRY?.DSN,
      debug: false,
      integrations: [
        new CaptureConsole({ levels: ['error', 'warn'] }),
        new Tracing.Integrations.Mysql(),
      ],
      sampleRate: configService.SENTRY?.SAMPLE_RATE,
      tracesSampleRate: configService.SENTRY?.TRACE_SAMPLE_RATE,
      environment: configService.ENV,
      maxBreadcrumbs: 50,
    });
  }

  const port = configService.PORT || 3333;

  await app.listen(port);

  NestLogger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
};
