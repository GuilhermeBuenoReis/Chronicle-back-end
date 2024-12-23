import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getNote } from '../functions/get-week-notes';

export const getNotesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/notes/summary',
    {
      schema: {
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
      const { result } = await getNote({ userId });

      return reply.status(200).send(result);
    }
  );
};
