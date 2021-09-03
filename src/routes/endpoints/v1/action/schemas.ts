import { Codec, string, boolean, enumeration, optional } from 'purify-ts/Codec';

export enum ActionType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SIMA = 'SIMA',
}

export const CreateActionInput = Codec.interface({
  imageData: optional(string),
  text: optional(string),
  type: enumeration(ActionType),
});

export const CreateActionResponse = Codec.interface({
  success: boolean,
});
