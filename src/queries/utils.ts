import {
  DatabaseTransactionConnectionType,
  TaggedTemplateLiteralInvocationType,
  sql,
} from 'slonik';
import { EitherAsync } from 'purify-ts';

export type DateTime = Date;

export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S;

export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnake<U>}`
  : S;

export const select = (columns: string[]) =>
  sql.join(
    columns.map(column => sql.identifier([column])),
    sql`, `,
  );

export const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export function fetchOne<I, O>(action: (i: I) => TaggedTemplateLiteralInvocationType<O>) {
  return (trx: DatabaseTransactionConnectionType, parameters: I) =>
    EitherAsync<unknown, O>(
      () => trx.one(action(parameters)),
    );
}

export function fetchAny<I, O>(action: (i: I) => TaggedTemplateLiteralInvocationType<O>) {
  return (trx: DatabaseTransactionConnectionType, parameters: I) =>
    EitherAsync<unknown, ReadonlyArray<O>>(
      () => trx.any(action(parameters)),
    );
}
