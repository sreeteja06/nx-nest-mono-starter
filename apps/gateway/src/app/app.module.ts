import { Logger, Module } from '@nestjs/common';
import { ConfigModule, LoggerModule } from '@sreeteja06/nest-core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [LoggerModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
