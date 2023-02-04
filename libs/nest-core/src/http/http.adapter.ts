/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { HttpRetryConfig } from './http.interface';

export abstract class IHttpService {
  abstract request<T = any>(
    config: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;

  abstract patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    retryConfig?: HttpRetryConfig | undefined
  ): Observable<AxiosResponse<T>>;
}
