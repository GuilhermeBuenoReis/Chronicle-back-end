import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateUser } from '../functions/create-user';

export const CreateUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user',
    {
      schema: {
        operationId: 'CreateUser',
        tags: ['folder'],
        description: 'Create a folder',
        body: z.object({
          email: z.string(),
          name: z.string(),
          password: z.string(),
          avatarUrl: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { name, email, avatarUrl, password } = request.body;

      await CreateUser({
        name,
        email,
        password,
        avatarUrl,
      });

      return reply.status(201).send();
    }
  );
};
