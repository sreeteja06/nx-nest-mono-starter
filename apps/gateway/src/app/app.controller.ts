import { Controller, Get, Logger } from '@nestjs/common';
import { storage } from 'nestjs-pino/storage';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @Get()
  getData() {
    const logger = storage.getStore();

    this.logger.log(typeof logger);
    return this.appService.getData();
  }
}
