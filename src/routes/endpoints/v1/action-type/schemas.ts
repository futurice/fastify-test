import { Codec, string, array, number } from 'purify-ts/Codec';

export const ActionTypeResponse = array(
  Codec.interface({
    code: string,
    name: string,
    cooldown: number,
  }),
);
