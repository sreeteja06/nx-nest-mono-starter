import { LogLevels } from '../logger/logger.enum';

export abstract class IConfigService {
  ENV: string | undefined;

  CACHE_ENABLED: boolean | undefined;
  REDIS_URL: string | undefined;

  ELK_URL: string | undefined;

  MONGO_EXPRESS_URL: string | undefined;
  JEAGER_URL: string | undefined;
  REDIS_COMMANDER_URL: string | undefined;
  KIBANA_URL: string | undefined;

  LOG_LEVEL: LogLevels | undefined;

  database:
    | {
        host: string | undefined;
        port: number | undefined;
        user: string | undefined;
        pass: string | undefined;
      }
    | undefined;
}
