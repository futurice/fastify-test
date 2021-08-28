import { FastifyPluginCallback } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import config from '../config';

const plugin: FastifyPluginCallback = (instance, _, done) => {
  if (config.NODE_ENV === 'production') {
    return done();
  }

  const routes: string[] = [];

  instance.addHook('onRoute', route => {
    if (!route.schema?.hide) {
      routes.push(`[${route.method}]\t${route.path}`);
    }
  });

  instance.addHook('onReady', done => {
    instance.log.info(`Routes:\n${routes.join('\n')}`);
    done();
  });

  done();
};

export const routePrinter = fastifyPlugin(plugin);
