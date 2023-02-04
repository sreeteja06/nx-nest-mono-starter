export abstract class ICacheService {
  abstract set(
    key: string,
    value: string | number | Buffer,
    ttl: string | number,
    allowError: boolean | undefined
  ): Promise<void>;

  abstract get(
    key: string,
    allowError: boolean | undefined
  ): Promise<string | undefined | null>;

  public abstract del(
    key: string[],
    allowError: boolean | undefined
  ): Promise<void>;

  public abstract flushCache(): Promise<void>;
}
