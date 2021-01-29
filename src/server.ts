import fastify from 'fastify'
import config from './config';
import routes from './routes';


async function initApp() {
  const app = fastify({ logger: true });
  app.register(routes, {prefix: '/api'});
  return app;
}

initApp()
  .then((app) => {
    app.listen(config.PORT, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      console.log(`Server listening at ${address}`);
    });
  });
