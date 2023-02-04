import { storage } from 'nestjs-pino/storage';

export const getReqIdFromPino = (): string | undefined => {
  const logger = storage.getStore()?.logger;
  if (logger) {
    return logger.bindings?.()?.['reqId'];
  }
  return undefined;
};
