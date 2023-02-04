import { Inject } from '@nestjs/common';

export const REDIS_MODULE_CONNECTION_TOKEN = 'IO_REDIS_MODULE_CONNECTION_TOKEN';

export const InjectRedis = () => {
  return Inject(REDIS_MODULE_CONNECTION_TOKEN);
};
