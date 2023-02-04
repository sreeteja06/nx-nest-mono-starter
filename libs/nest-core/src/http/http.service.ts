/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios';
import { Observable, ObservableInput, of, retry } from 'rxjs';
import { Injectable, Logger } from '@nestjs/common';
import { getReqIdFromPino } from '../logger/logger.util';
import { LogLevels } from '../logger/logger.enum';
import { IConfigService } from '../config/config.adapter';
import { v4 as uuidV4 } from 'uuid';
import { AxiosRequestData, HttpRetryConfig } from './http.interface';
import { IHttpService } from './http.adapter';

const defaultRetryConfig = {
  count: 3,
  delayMultiplier: 200,
};

@Injectable()
export class HttpService implements IHttpService {
  private readonly _instance: AxiosInstance = Axios.create({});
  private readonly _logger: Logger = new Logger(HttpService.name);

  constructor(private readonly configService: IConfigService) {
    // Interceptors to add requestId to outgoing requests and to log the response times
    this._instance.interceptors.request.use(
      (axiosRequestConfig: InternalAxiosRequestConfig<AxiosRequestData>) => {
        const reqId = getReqIdFromPino();
        axiosRequestConfig.data = {
          requestStartTime: Date.now(),
        };
        if (axiosRequestConfig.headers) {
          axiosRequestConfig.headers['x-request-id'] = reqId || uuidV4();
        }
        return axiosRequestConfig;
      }
    );
    this._instance.interceptors.response.use(
      (response: AxiosResponse<any, AxiosRequestData>) => {
        this._logRequestCall(response);
        return response;
      },
      async (error: AxiosError<any, AxiosRequestData>) => {
        this._logRequestError(error);
        return Promise.reject(error);
      }
    );
  }

  get axiosRef(): AxiosInstance {
    return this._instance;
  }

  request<T = any>(
    config: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(retryConfig, this._instance.request, config);
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(retryConfig, this._instance.get, url, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(
      retryConfig,
      this._instance.delete,
      url,
      config
    );
  }

  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(
      retryConfig,
      this._instance.head,
      url,
      config
    );
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(
      retryConfig,
      this._instance.post,
      url,
      data,
      config
    );
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(
      retryConfig,
      this._instance.put,
      url,
      data,
      config
    );
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig = defaultRetryConfig
  ): Observable<AxiosResponse<T>> {
    return this.makeObservable<T>(
      retryConfig,
      this._instance.patch,
      url,
      data,
      config
    );
  }

  private makeObservable<T>(
    retryConfig: HttpRetryConfig,
    axios: (...args: any[]) => AxiosPromise<T>,
    ...args: any[]
  ): Observable<AxiosResponse<T>> {
    return new Observable<AxiosResponse<T>>((subscriber) => {
      const config: AxiosRequestConfig = {
        ...(args[args.length - 1] || {}),
      };

      let cancelSource: CancelTokenSource | undefined = undefined;
      if (!config.cancelToken) {
        cancelSource = Axios.CancelToken.source();
        config.cancelToken = cancelSource.token;
      }

      axios(...args)
        .then((res) => {
          subscriber.next(res);
          subscriber.complete();
        })
        .catch((err) => {
          subscriber.error(err);
        });
      return (): void => {
        if (config.responseType === 'stream') {
          return;
        }

        if (cancelSource) {
          cancelSource.cancel();
        }
      };
    }).pipe(
      retry({
        count: retryConfig.count,
        delay: (error, retryCount): ObservableInput<number> => {
          const DELAY_MS = retryCount * retryConfig.delayMultiplier;
          this._logger.warn(
            `Retrying request to ${error?.config?.url} in ${DELAY_MS}ms`
          );
          return of(DELAY_MS);
        },
      })
    );
  }

  private _logRequestCall(
    response: AxiosResponse<any, AxiosRequestData>
  ): void {
    let logData = undefined;
    let logLevel: LogLevels = LogLevels.LOG;

    const duration = Date.now() - (response.config.data?.requestStartTime || 0);

    switch (this.configService.LOG_LEVEL) {
      case LogLevels.DEBUG:
        logLevel = LogLevels.DEBUG;
        logData = {
          request: {
            url: response.config.url,
            method: response.config.method,
            headers: response.config.headers,
            data: response.config.data,
          },
          response: {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers,
            duration,
          },
        };
        break;
      case LogLevels.LOG:
        logData = {
          method: response.config.method,
          url: response.config.url,
          status: response.status,
          duration,
        };
        break;
      case LogLevels.VERBOSE:
        logLevel = LogLevels.VERBOSE;
        logData = {
          ...response,
          duration,
        };
        break;
      default:
        break;
    }

    this._logger[logLevel](logData);
  }

  private _logRequestError(error: AxiosError<any, AxiosRequestData>): void {
    const err = new Error(error.message);

    err.name = error.name;
    err.stack = error.stack;

    const duration =
      Date.now() -
      (error.response?.config?.data?.requestStartTime || Date.now());

    this._logger.error({
      ...err,
      request: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data,
        params: error.config?.params,
      },
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        duration,
      },
    });
  }
}
