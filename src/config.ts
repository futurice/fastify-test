import { Codec, string, GetType } from 'purify-ts';
import { NumberFromString } from 'purify-ts-extra-codec';

const configSchema = Codec.interface({
  NODE_ENV: string,
  PORT: NumberFromString,
  DATABASE_URL: string,
  TOKEN: string,
});

export type Config = GetType<typeof configSchema>;

let config!: Config;

if (config === undefined) {
  configSchema
    .decode(process.env)
    .ifRight(encoded => {
      config = encoded;
    })
    .ifLeft(err => {
      console.error(`Configuration validation failed: ${err}`);
      console.error('Shutting down the process...');
      process.exit(1);
    });
}

export default config;
