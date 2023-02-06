import { Logger, Module } from '@nestjs/common';
import {
  ConfigModule,
  LoggerModule,
  RedisModule,
  TypeOrmModule,
} from '@sreeteja06/nest-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    RedisModule,
    TypeOrmModule.forRoot({
      appName: 'gateway',
      entities: [],
      type: 'postgres',
      maxQueryExecutionTime: 1000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
