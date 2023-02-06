import { HttpException, HttpStatus } from '@nestjs/common';

const getHttpStatusFromError = (error: Error): number => {
  return error instanceof HttpException
    ? error.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export { getHttpStatusFromError };
