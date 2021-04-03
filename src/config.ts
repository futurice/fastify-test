import * as yup from 'yup';

const configSchema = yup.object({
  PORT: yup.number().default(8080),
});

export type Config = yup.Asserts<typeof configSchema>;

let config!: Config;

if (config === undefined) {
  config = configSchema.validateSync(process.env, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export default config;
