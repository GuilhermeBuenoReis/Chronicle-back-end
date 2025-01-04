import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { updateNoteById } from '../functions/update-note-by-id';

export const updatedNoteRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/notes/update/:id',
    {
      schema: {
        operationId: 'updatedNote',
        tags: ['notes', 'tags'],
        description: 'updated note',
        querystring: z.object({
          id: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          tags: z.string().optional(),
        }),
        response: {
          201: z.object({
            updatedNote: z.object({
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
      const { title, content, tags } = request.body;
      const { updatedNote } = await updateNoteById({
        noteId: notesId,
        title,
        content,
        tags,
      });

      if (!updatedNote) {
        return reply.status(401).send({
          message:
            'Não foi possível atualizar a nota! Tente novamente mais tarde.',
        });
      }

      return reply.status(201).send({ updatedNote });
    }
  );
};
