import fastify from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import config from './config';
import routes from './routes';
import { docs } from './docs';


async function initApp() {
  const app = fastify({ logger: true });
  app.register(fastifyPlugin(docs));
  app.register(routes, {prefix: '/api'});

  app.ready(err => {
    if (err) throw err
    app.swagger();
  });
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
