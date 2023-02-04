import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Pagination } from './pagination';
import { PaginateOptionsDto } from './paginate-options.dto';

// using skip/take instead of limit offset due to this issue
// https://github.com/typeorm/typeorm/issues/8014

export async function paginateRaw<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto
): Promise<Pagination<T>> {
  const { page = 1, limit = 100 } = options;

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    queryBuilder
      .clone()
      .take(limit)
      .skip((page - 1) * limit)
      .getRawMany<T>(),
    queryBuilder.take().skip().getCount(),
  ];

  const [items, total] = await Promise.all(promises);

  return {
    items,
    meta: {
      currentPage: page,
      itemCount: items.length,
      itemsPerPage: limit,
      totalItems: total || 0,
      totalPages: Math.ceil((total || 0) / limit),
    },
  };
}

async function paginateQueryBuilder<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto
): Promise<Pagination<T>> {
  const { page = 1, limit = 100 } = options;

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    queryBuilder
      .clone()
      .take(limit)
      .skip((page - 1) * limit)
      .getMany(),
    queryBuilder.take().skip().getCount(),
  ];

  const [items, total] = await Promise.all(promises);

  return {
    items,
    meta: {
      currentPage: page,
      itemCount: items.length,
      itemsPerPage: limit,
      totalItems: total || 0,
      totalPages: Math.ceil((total || 0) / limit),
    },
  };
}

export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto
): Promise<Pagination<T>> {
  return paginateQueryBuilder<T>(queryBuilder, options);
}

export async function paginateWithIterator<T extends ObjectLiteral, IT>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto,
  iterator: (item: T) => IT
): Promise<Pagination<IT>> {
  const results = await paginateQueryBuilder<T>(queryBuilder, options);
  return {
    items: results.items.map(iterator),
    meta: results.meta,
  };
}

export async function paginateWithPromiseIterator<T extends ObjectLiteral, IT>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto,
  iterator: (item: T) => Promise<IT>
): Promise<Pagination<IT>> {
  const results = await paginateQueryBuilder<T>(queryBuilder, options);
  return {
    items: await Promise.all(results.items.map(iterator)),
    meta: results.meta,
  };
}

export async function paginateRawWithIterator<T extends ObjectLiteral, IT>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginateOptionsDto,
  iterator: (item: T) => IT
): Promise<Pagination<IT>> {
  const results = await paginateRaw<T>(queryBuilder, options);
  return {
    items: results.items.map(iterator),
    meta: results.meta,
  };
}
