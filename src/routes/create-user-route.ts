import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { CreateUser } from '../functions/create-user';

export const CreateUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'CreateUser',
        tags: ['folder'],
        description: 'Create a folder',
        body: z.object({
          email: z.string(),
          name: z.string(),
          avatarUrl: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { name, email, avatarUrl } = request.body;

      await CreateUser({
        name,
        email,
        avatarUrl,
      });

      return reply.status(201).send();
    }
  );
};
