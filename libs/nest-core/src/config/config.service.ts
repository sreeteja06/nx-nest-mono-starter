import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { LogLevels } from '../logger/logger.enum';
import { IConfigService } from './config.adapter';

@Injectable()
export class ConfigService extends NestConfigService implements IConfigService {
  constructor() {
    super();
  }

  ELK_URL = this.get('ELK_URL');

  CACHE_ENABLED = this.get('CACHE_ENABLED') === 'true';

  MONGO_EXPRESS_URL = this.get('MONGO_EXPRESS_URL');
  REDIS_COMMANDER_URL = this.get('REDIS_COMMANDER_URL');
  JEAGER_URL = this.get('JEAGER_URL');
  KIBANA_URL = this.get('KIBANA_URL');

  REDIS_URL = this.get('REDIS_URL');

  ENV = this.get('ENV');

  LOG_LEVEL = this.get<LogLevels>('LOG_LEVEL');

  TYPEORM = {
    HOST: this.get('TYPEORM_HOST'),
    PORT: this.get<number>('TYPEORM_PORT'),
    USER: this.get('TYPEORM_USERNAME'),
    PASS: this.get('TYPEORM_PASSWORD'),
    DATABASE: this.get('TYPEORM_DATABASE'),
    LOGGING: this.get('TYPEORM_LOGGING') === 'true',
  };

  SENTRY_ENABLED = this.get('SENTRY_ENABLED') === 'true';
}
