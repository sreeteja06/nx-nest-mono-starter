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

  SENTRY_ENABLED?: boolean;
}
