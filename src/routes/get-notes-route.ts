import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getNotes } from '../functions/get-notes';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const getNotesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/notes/summary',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'getNotes',
        tags: ['notes'],
        description: 'Get week summary notes',
        response: {
          200: z.object({
            result: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                content: z.string(),
                folderId: z.string().nullable(),
                tags: z.string().nullable(),
                createdAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      console.log(userId);
      const { result } = await getNotes({ userId });

      return reply.status(200).send({ result });
    }
  );
};
