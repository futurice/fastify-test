import {
  InterceptorType,
  FieldType,
  QueryResultRowColumnType,
} from 'slonik';

export const transformNameInterceptors: () => InterceptorType = () => {
  const underscoreFieldRegex = /^[a-z0-9_]+$/;

  const underscoreFieldTest = (field: FieldType) => {
    return underscoreFieldRegex.test(field.name);
  };

  const toCamelCase = (input: string) =>
    input
      .split('_')
      .reduce(
        (res, word, i) =>
          i === 0
            ? word.toLowerCase()
            : `${res}${word.charAt(0).toUpperCase()}${word
                .substr(1)
                .toLowerCase()}`,
        '',
      );

  return {
    transformRow: (context, _, row, fields) => {
      if (!context.sandbox.formattedFields) {
        context.sandbox.formattedFields = fields.map(field => ({
          formatted: underscoreFieldTest(field)
            ? toCamelCase(field.name)
            : field.name,
          original: field.name,
        }));
      }

      const formattedFields = context.sandbox.formattedFields as {
        formatted: string;
        original: string;
      }[];

      const transformedRow: Record<string, QueryResultRowColumnType> = {};

      for (const field of formattedFields) {
        if (typeof field.formatted !== 'string') {
          throw new TypeError('Unexpected field name type.');
        }

        transformedRow[field.formatted] = row[field.original];
      }

      return transformedRow;
    },
  };
};
