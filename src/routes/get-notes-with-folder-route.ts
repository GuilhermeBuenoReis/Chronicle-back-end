import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getNotes } from '../functions/get-notes';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { getNotesWithFolder } from '../functions/get-notes-with-folder';

export const getNotesWithFolderRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/notes/summary/',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'getNotesWithFolder',
        tags: ['notes'],
        description: 'Get notes with folder',
        querystring: z.object({
          folder_id: z.string(),
        }),
        response: {
          200: z.object({
            result: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                content: z.string(),
                folder_id: z.string().nullable(),
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
      const { folder_id } = request.query;
      const { result } = await getNotesWithFolder({
        userId,
        folder_id,
      });

      return reply.status(200).send({ result });
    }
  );
};
