import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { IConfigService } from '../config/config.adapter';
import { ConfigModule } from '../config/config.module';
import { REDIS_MODULE_CONNECTION_TOKEN } from './redis.constants';
import { RedisHealthIndicator } from './redis.health';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_MODULE_CONNECTION_TOKEN,
      useFactory: ({ REDIS_URL }: IConfigService) => {
        if (!REDIS_URL) {
          throw new Error('REDIS_URL is not defined');
        }
        return new Redis(REDIS_URL);
      },
      inject: [IConfigService],
    },
    RedisHealthIndicator,
  ],
  exports: [REDIS_MODULE_CONNECTION_TOKEN, RedisHealthIndicator],
})
export class RedisModule {}
