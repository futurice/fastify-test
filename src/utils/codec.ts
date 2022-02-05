import { Codec, string } from 'purify-ts';

export const optionalWithDefault = <T>(codec: Codec<T>, defaultValue: T) => ({
  _isOptional: true,
  ...Codec.custom<T>({
    decode: value => codec.decode(value === undefined ? defaultValue : value),
    encode: value => codec.encode(value === undefined ? defaultValue : value),
    schema: () => ({
      ...codec.schema(),
      default: defaultValue,
    }),
  }),
});

export const regexStr = (regex: RegExp) =>
  Codec.custom<string>({
    decode: string.decode,
    encode: string.encode,
    schema: () => {
      return {
        ...string.schema(),
        pattern: regex.source,
      };
    },
  });

export const uuid = regexStr(
  /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[4][0-9a-zA-Z]{3}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}$/,
);
