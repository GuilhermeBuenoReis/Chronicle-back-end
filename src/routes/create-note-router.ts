import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateNote } from '../functions/create-note';

export const CreateNoteRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/note',
    {
      schema: {
        operationId: 'CreateNote',
        tags: ['note'],
        description: 'Create a folder',
        body: z.object({
          userId: z.string(),
          title: z.string(),
          content: z.string(),
          tags: z.string().optional(),
          folderId: z.string().optional(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      // const userId = request.user.sub;
      const { title, content, tags, userId, folderId } = request.body;

      await CreateNote({
        title,
        content,
        tags,
        userId,
        folderId,
      });

      return reply.status(201).send();
    }
  );
};
