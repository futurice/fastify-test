import {
  DatabaseTransactionConnectionType,
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

export type Transaction = DatabaseTransactionConnectionType;

export function buildQuery<I, O>(
  action: (
    trx: Transaction,
    i: I
  ) => Promise<Readonly<O>>
) {
  return (
    trx: Transaction,
    parameters: I
  ) =>
    EitherAsync<unknown, Readonly<O>>(
      () => action(trx, parameters),
    );
}
