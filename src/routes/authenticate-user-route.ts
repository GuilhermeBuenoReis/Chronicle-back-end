import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getUserByEmailAndPassword } from '../functions/find-user-by-email-and-password';
import { authenticate } from '../functions/authenticate-user';

export const AuthenticateUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/auth/authenticate',
    {
      schema: {
        operationId: 'AuthenticateUserRoute',
        tags: ['user', 'auth'],
        description: 'Authenticate user',
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { token } = await authenticate({ email, password });

      return reply.status(201).send({ token });
    }
  );
};
