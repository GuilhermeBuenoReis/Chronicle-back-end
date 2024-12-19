import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { getUser } from '../functions/get-user';

export const getProfileRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/profile',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'getProfile',
        tags: ['user'],
        description: 'Get user profile',
        response: {
          200: z.object({
            profile: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().nullable(),
              avatarUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { user } = await getUser({
        userId,
      });

      return reply.status(200).send({ profile: user });
    }
  );
};
