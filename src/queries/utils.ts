import {
  DatabasePoolConnectionType,
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

export type DatabaseConnection =
  | DatabasePoolConnectionType
  | DatabaseTransactionConnectionType;

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type Query = (...args: any) => any;
type QueryBuilder = <TQuery extends Query>(
  query: TQuery,
) => (
  ...args: Parameters<TQuery>
) => EitherAsync<unknown, Awaited<ReturnType<TQuery>>>;

export const query: QueryBuilder = dbQuery => {
  return (...args) => {
    return EitherAsync(() => dbQuery(...((args as unknown) as any)));
  };
};
