import { Get } from '@nestjs/common';
import { Controller } from '@sreeteja06/nest-core';

import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
