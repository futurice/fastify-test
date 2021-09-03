import { Codec, string, GetType } from 'purify-ts';
import { NumberFromString } from 'purify-ts-extra-codec';

const configCodec = Codec.interface({
  NODE_ENV: string,
  PORT: NumberFromString,
  DATABASE_URL: string,
  TOKEN: string,
  REDIS_URL: string,
});

export type Config = GetType<typeof configCodec>;

let config!: Config;

if (config === undefined) {
  config = configCodec.decode(process.env).caseOf({
    Right: result => result,
    Left: err => {
      console.error(`Configuration validation failed: ${err}`);
      console.error('Shutting down the process...');
      process.exit(1);
    },
  });
}

export default config;
