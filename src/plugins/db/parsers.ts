import type { TypeParserType } from 'slonik';
import { format } from 'date-fns';

const timestamp = `yyyy-MM-dd'T'HH:mm:ss.SSS`;
const timestampz = `${timestamp}X`;

const timestampParser = (dateFormat: string) => (value: string | null) => {
  return value === null
    ? value
    : format(Date.parse(value + ' UTC'), dateFormat);
};

export const createTimestampWithTimeZoneTypeParser = (): TypeParserType => {
  return {
    name: 'timestamptz',
    parse: timestampParser(timestampz),
  };
};

export const createTimestampTypeParser = (): TypeParserType => {
  return {
    name: 'timestamp',
    parse: timestampParser(timestamp),
  };
};
