import { sql } from 'slonik';

type CamelToSnake<T extends string> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
  ? `${C0 extends Uppercase<C0> ? '_' : ''}${Lowercase<C0>}${CamelToSnake<R>}`
  : '';

export type DBRow<Type> = keyof {
  [Property in keyof Type as `${CamelToSnake<
    string & Property
  >}`]: () => Type[Property];
};

export const select = (columns: string[]) =>
  sql.join(
    columns.map(column => sql.identifier([column])),
    sql`, `,
  );
