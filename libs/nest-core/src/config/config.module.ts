import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { IConfigService } from './config.adapter';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
      cache: true,
    }),
  ],
  providers: [
    {
      provide: IConfigService,
      useClass: ConfigService,
    },
  ],
  exports: [IConfigService],
})
export class ConfigModule {}
