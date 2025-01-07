import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getNotes } from '../functions/get-notes';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const getNotesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/notes/summary',
    {
      schema: {
        onRequest: [authenticateUserHook],
        operationId: 'getNotesRoute',
        tags: ['notes'],
        description: 'Get week summary notes',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              tags: z.string().nullable(),
              createdAt: z.date(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = 'n6u53804o7fjhg08tit8csc1';
      const { result } = await getNotes({ userId });

      return reply.status(200).send(result);
    }
  );
};
