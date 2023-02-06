import { LogLevels } from '../logger/logger.enum';

export abstract class IConfigService {
  ENV: string | undefined;

  CACHE_ENABLED: boolean | undefined;
  REDIS_URL: string | undefined;

  LOG_LEVEL: LogLevels | undefined;

  TYPEORM:
    | {
        HOST: string | undefined;
        PORT: number | undefined;
        USER: string | undefined;
        PASS: string | undefined;
        DATABASE: string | undefined;
        LOGGING: boolean | undefined;
      }
    | undefined;

  SWAGGER:
    | {
        USERNAME: string | undefined;
        PASSWORD: string | undefined;
      }
    | undefined;

  SENTRY:
    | {
        DSN: string | undefined;
        ENABLED: boolean | undefined;
        SAMPLE_RATE: number | undefined;
        TRACE_SAMPLE_RATE: number | undefined;
      }
    | undefined;

  PORT?: number;
}
