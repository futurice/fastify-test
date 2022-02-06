import {
  Codec,
  string,
  boolean,
  optional,
  exactly,
  oneOf,
} from 'purify-ts/Codec';

export enum ActionType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  SIMA = 'SIMA',
}

export const createSimaActionDTO = Codec.interface({
  type: exactly(ActionType.SIMA),
});

export const createImageActionDTO = Codec.interface({
  imageData: string,
  text: optional(string),
  type: exactly(ActionType.IMAGE),
});

export const createTextActionDTO = Codec.interface({
  text: string,
  type: exactly(ActionType.TEXT),
});

export const createActionDTO = oneOf([
  createSimaActionDTO,
  createImageActionDTO,
  createTextActionDTO,
]);

export const createActionResponse = Codec.interface({
  success: boolean,
});
