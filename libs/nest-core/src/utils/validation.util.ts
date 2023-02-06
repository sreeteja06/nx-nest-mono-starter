import { ExposeMetadata } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { joinNotEmptyNorWhitespace } from './array.util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

export function flattenValidationErrors(
  validationErrors: ValidationError[],
  fullParentProperty = '',
  parentTarget?: unknown,
  parentProperty = ''
): string[] {
  const flatValidationErrors: string[] = [];

  if (Array.isArray(validationErrors)) {
    for (const validationError of validationErrors) {
      const { target: currentTarget, property: initialCurrentProperty } =
        validationError;
      let currentProperty: string = initialCurrentProperty;

      if (currentTarget) {
        // Check if property name should be exposed as a different property name
        const exposeMetadata: ExposeMetadata | undefined =
          defaultMetadataStorage.findExposeMetadata(
            currentTarget.constructor,
            currentProperty
          );
        currentProperty =
          exposeMetadata?.options.name ?? initialCurrentProperty;
      }

      // For array validations property name can be an index so format it as 'parent[index]'
      const fullProperty: string = !isNaN(Number(currentProperty))
        ? `${fullParentProperty}[${currentProperty}]`
        : // Special case for array validations to avoid duplication of property name in the message
        parentTarget !== currentTarget && parentProperty !== currentProperty
        ? joinNotEmptyNorWhitespace([fullParentProperty, currentProperty], '.')
        : fullParentProperty;

      if (typeof validationError.constraints === 'object') {
        for (const constraintKey of Object.keys(validationError.constraints)) {
          flatValidationErrors.push(
            `${fullProperty}: ${validationError.constraints[
              constraintKey
            ].replace(initialCurrentProperty, currentProperty)}`
          );
        }
      }

      flatValidationErrors.push(
        ...flattenValidationErrors(
          validationError.children ?? [],
          fullProperty,
          currentTarget,
          currentProperty
        )
      );
    }
  }

  return flatValidationErrors;
}

export function flattenIfValidationError<T>(
  error: T,
  stack?: string
): Error | T {
  if (
    (Array.isArray(error) &&
      error.length > 0 &&
      error[0] instanceof ValidationError) ||
    error instanceof ValidationError
  ) {
    const e = new Error(
      flattenValidationErrors(
        error instanceof ValidationError ? [error] : error
      )?.join('\n') ?? ''
    );
    e.stack = stack;
    return e;
  }
  return error;
}
