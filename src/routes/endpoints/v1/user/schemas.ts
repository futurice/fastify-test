import { Codec, string } from 'purify-ts/Codec';
import { Integer } from 'purify-ts-extra-codec';
import { uuid, regexStr } from '../../../../utils/codec';

// Allow ASCI letters, digits, hyphens and underscore.
// TODO: Unicode charactes
const nameRegEx = /^[a-zA-Z\d\-_]{2,30}$/;

export const userRegistration = Codec.interface({
  name: regexStr(nameRegEx),
  teamId: Integer,
});

export const userRegistrationResponse = Codec.interface({
  uuid: uuid,
  name: string,
  teamId: Integer,
});
