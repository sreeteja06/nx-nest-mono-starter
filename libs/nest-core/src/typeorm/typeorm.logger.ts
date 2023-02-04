import { Logger as TypeormBaseLogger, LoggerOptions } from 'typeorm';
import { Logger } from '@nestjs/common';

export default class TypeormLogger implements TypeormBaseLogger {
  private readonly _logger: Logger = new Logger();

  constructor(private readonly _options?: LoggerOptions) {}

  logQuery(query: string, parameters?: unknown[]): void {
    if (this.isLoggingEnabled('query', true)) {
      this._logger.log({ query, parameters });
    }
  }

  logQueryError(error: string, query: string, parameters?: unknown[]): void {
    // always print query errors
    this._logger.error({ error, query, parameters });
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]): void {
    this._logger.warn({
      slowQuery: query,
      parameters,
      timeTaken: `${time} ms`,
    });
  }

  logSchemaBuild(message: string): void {
    if (this.isLoggingEnabled('schema', false)) {
      this._logger.log(message);
    }
  }

  logMigration(message: string): void {
    this._logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: unknown): void {
    switch (level) {
      case 'warn':
        if (this.isLoggingEnabled('warn', false)) {
          this._logger.warn(message);
        }
        break;
      case 'log':
      case 'info':
      default:
        if (
          this.isLoggingEnabled('info', false) ||
          this.isLoggingEnabled('log', false)
        ) {
          this._logger.log(message);
        }
        break;
    }
  }

  private isLoggingEnabled(
    logType: 'log' | 'info' | 'warn' | 'error' | 'schema' | 'query',
    booleanOption = false
  ): boolean {
    if (this._options === 'all' || (booleanOption && this._options === true)) {
      return true;
    } else if (Array.isArray(this._options)) {
      return this._options.includes(logType);
    }
    return false;
  }
}
