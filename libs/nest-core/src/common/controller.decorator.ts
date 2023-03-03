import { applyDecorators, Controller as NestController } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const Controller = (name: string, version = '1'): ClassDecorator => {
  return applyDecorators(
    NestController({ path: name, version: version }),
    ApiTags(name)
  );
};
