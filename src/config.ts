import * as yup from 'yup';

const configSchema = yup.object({
  PORT: yup.number().default(8000),
  DATABASE_URL: yup.string().required(),
});

export type Config = yup.Asserts<typeof configSchema>;

let config!: Config;

if (config === undefined) {
  try {
    config = configSchema.validateSync(process.env, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (err) {
    const validationErr = err as yup.ValidationError;
    console.error('Configuration validation failed:');
    console.error(`${validationErr.name}: ${validationErr.errors.join(', ')}`);
    console.error('Shutting down the process...');
    process.exit(1);
  }
}

export default config;
