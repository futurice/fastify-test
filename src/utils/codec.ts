import { Codec } from 'purify-ts';

export const optionalWithDefault = <T>(codec: Codec<T>, defaultValue: T) => ({
  _isOptional: true,
  ...Codec.custom<T>({
    decode: value => {
      console.log('decode');
      return codec.decode(value === undefined ? defaultValue : value);
    },
    encode: value => {
      console.log('encode');
      return codec.encode(value === undefined ? defaultValue : value);
    },
    schema: () => ({
      ...codec.schema(),
      default: defaultValue,
    }),
  }),
});
