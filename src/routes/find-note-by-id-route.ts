import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { findNoteById } from '../functions/find-note-by-id';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const findNotesByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/notes/:id',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'findNotesById',
        tags: ['notes', 'tags'],
        description: 'Find notes by id',
        querystring: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            note: z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              tags: z.string().nullable(),
              createdAt: z.date(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const notesId = request.query.id;
      const { note } = await findNoteById({ noteId: notesId });

      if (!note) {
        return reply.status(401).send({ message: 'Nenhuma nota encontrada.' });
      }

      return reply.status(200).send({ note });
    }
  );
};
