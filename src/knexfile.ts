import * as path from 'path';
import config from './config';
import { Knex } from 'knex';

const settings: Knex.Config = {
  client: 'pg',
  connection: config.DATABASE_URL,
  migrations: {
    directory: path.join(__dirname, './migrations'),
  },
  debug: false,
};

export const opts = {
  test: settings,
  development: settings,

  config: settings,
};

export default opts;
