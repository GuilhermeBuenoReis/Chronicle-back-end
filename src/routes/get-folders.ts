import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { getFolder } from '../functions/get-folders';

export const getFoldersRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/folder/summary',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'getFolders',
        tags: ['folder'],
        description: 'Get folder',
        response: {
          200: z.object({
            result: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { result } = await getFolder({ userId });

      return reply.status(200).send({ result });
    }
  );
};
