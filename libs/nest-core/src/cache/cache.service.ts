import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { IConfigService } from '../config/config.adapter';
import { InjectRedis } from '../redis/redis.constants';
import { ICacheService } from './cache.adapter';

@Injectable()
export class CacheService implements ICacheService {
  private readonly _logger = new Logger(CacheService.name);

  constructor(
    @InjectRedis()
    private readonly _redis: Redis,
    private readonly configService: IConfigService
  ) {}

  public async set(
    key: string,
    value: string | number | Buffer,
    ttl: string | number,
    allowError = true
  ): Promise<void> {
    if (!this.configService.CACHE_ENABLED) {
      return;
    }
    try {
      if (ttl) {
        await this._redis.set(key, value, 'EX', ttl);
      } else {
        await this._redis.set(key, value);
      }
    } catch (error) {
      this._logger.error(error);
      if (!allowError) {
        throw error;
      }
    }
  }

  public async get(
    key: string,
    allowError = true
  ): Promise<string | undefined | null> {
    if (!this.configService.CACHE_ENABLED) {
      return;
    }
    try {
      return await this._redis.get(key);
    } catch (error) {
      this._logger.error(error);
      if (!allowError) {
        throw error;
      }
    }
    return undefined;
  }

  public async del(key: string[], allowError = true): Promise<void> {
    try {
      if (!key?.length) {
        return;
      }
      await this._redis.del(key);
    } catch (error) {
      this._logger.error(error);
      if (!allowError) {
        throw error;
      }
    }
  }

  public async flushCache(): Promise<void> {
    await this._redis.flushdb();
  }
}
