import { Codec } from 'purify-ts';

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
