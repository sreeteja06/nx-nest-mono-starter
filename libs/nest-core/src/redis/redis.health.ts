import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { InjectRedis } from './redis.constants';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@InjectRedis() private readonly _redis: Redis) {
    super();
  }

  async pingCheck(): Promise<HealthIndicatorResult> {
    try {
      const result = await this._redis.ping();
      if (result === 'PONG') {
        return {
          redis: {
            status: 'up',
          },
        };
      }
      throw new HealthCheckError('Redis ping failed', result);
    } catch (error) {
      throw new HealthCheckError('Redis ping failed', error);
    }
  }
}
