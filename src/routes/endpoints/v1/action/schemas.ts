import { Codec, string, boolean, enumeration, optional } from 'purify-ts/Codec';

export enum ActionType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SIMA = 'SIMA',
}

export const createActionDTO = Codec.interface({
  imageData: optional(string),
  text: optional(string),
  type: enumeration(ActionType),
});

export const createActionResponse = Codec.interface({
  success: boolean,
});
