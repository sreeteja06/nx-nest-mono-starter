import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { IConfigService } from '../config/config.adapter';
import { ConfigModule } from '../config/config.module';
import { LogLevels } from './logger.enum';
import { v4 as uuidV4 } from 'uuid';
import pinoTransport from './pino.transport';
import { IncomingMessage } from 'http';

const mapLogLevel = (
  logLevel: LogLevels
): 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' => {
  switch (logLevel) {
    case LogLevels.DEBUG:
      return 'debug';
    case LogLevels.LOG:
      return 'info';
    case LogLevels.WARN:
      return 'warn';
    case LogLevels.ERROR:
      return 'error';
    case LogLevels.VERBOSE:
      return 'trace';
  }
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: IConfigService) => ({
        pinoHttp: [
          {
            useLevel: mapLogLevel(configService.LOG_LEVEL ?? LogLevels.LOG),
            redact: ['req.headers.authorization'],
            quietReqLogger: configService.LOG_LEVEL !== LogLevels.VERBOSE,
            genReqId: (req: IncomingMessage): string => {
              if (req.headers['x-request-id']) {
                if (typeof req.headers['x-request-id'] === 'string') {
                  return req.headers['x-request-id'];
                } else if (Array.isArray(req.headers['x-request-id'])) {
                  return req.headers['x-request-id'][0];
                }
              }
              return uuidV4();
            },
            formatters: {
              level: (label: string): { level: string } => {
                return { level: label };
              },
            },
          },
          pinoTransport(configService.SENTRY_ENABLED),
        ],
        exclude: [{ method: RequestMethod.GET, path: 'api/healthz' }],
      }),
      inject: [IConfigService],
    }),
  ],
})
export class LoggerModule {}
