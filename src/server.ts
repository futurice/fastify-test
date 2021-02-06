import throng from 'throng';
import { build } from './app';
import config from './config';

const startServer = () => {
  const app = build({ logger: { prettyPrint: true } });
  app.listen(config.PORT, err => {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
  });
};

throng({
  workers: config.WEB_CONCURRENCY,
  lifetime: Infinity,
  start: startServer,
  grace: 10000, // Grace period for shutting down workers
});
