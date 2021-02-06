import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import basicAuth from 'fastify-basic-auth';

type Validation = (
  username: string,
  password: string,
  req: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void,
) => void | Promise<void>;

export const validate: Validation = (username, password, req, reply, done) => {
  req.log.info({ username, password });
  if (username === 'test' && password === 'TestTest1') {
    done();
  }

  done(new Error('None shall pass!'));
};

export const validator: FastifyPluginAsync = async fastify => {
  fastify.register(basicAuth, { validate });
};
