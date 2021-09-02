import { build } from './app';
import config from './config';

const startServer = () => {
  const app = build({
    logger: { prettyPrint: config.NODE_ENV === 'development' },
  });
  app.listen(config.PORT, '0.0.0.0', err => {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  });
};

startServer();
