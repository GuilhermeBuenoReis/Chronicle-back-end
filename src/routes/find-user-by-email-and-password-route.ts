import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getUserByEmailAndPassword } from '../functions/find-user-by-email-and-password';

export const getUserByEmailAndPasswordRoute: FastifyPluginAsyncZod =
  async app => {
    app.post(
      '/auth/find',
      {
        schema: {
          operationId: 'getUserByEmailAndPassword',
          tags: ['user', 'auth'],
          description: 'Get user by email and passowrd',
          body: z.object({
            email: z.string(),
            password: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { email, password } = request.body;
        const { user } = await getUserByEmailAndPassword({ email, password });

        return reply.status(201).send();
      }
    );
  };
