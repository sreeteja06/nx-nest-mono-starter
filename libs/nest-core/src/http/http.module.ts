import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { IHttpService } from './http.adapter';
import { HttpService } from './http.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IHttpService,
      useClass: HttpService,
    },
  ],
  exports: [IHttpService],
})
export class HttpModule {}
