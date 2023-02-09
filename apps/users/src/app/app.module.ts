import { Logger, Module } from '@nestjs/common';
import {
  ConfigModule,
  LoggerModule,
  RedisModule,
  TypeOrmModule,
} from '@sreeteja06/nest-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entity/user.entity';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    RedisModule,
    TypeOrmModule.forRoot({
      appName: 'users',
      autoLoadEntities: true,
      type: 'postgres',
      maxQueryExecutionTime: 1000,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
