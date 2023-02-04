import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { RedisModule } from '../redis/redis.module';
import { ICacheService } from './cache.adapter';
import { CacheService } from './cache.service';

@Module({
  imports: [RedisModule, ConfigModule],
  providers: [
    {
      provide: ICacheService,
      useClass: CacheService,
    },
  ],
  exports: [ICacheService],
})
export class CacheModule {}
