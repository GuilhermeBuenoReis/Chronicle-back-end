import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateNote } from '../functions/create-note';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { createNoteByFolder } from '../functions/create-note-by-folder';

export const CreateNoteByFolderRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/folder/note/create',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'CreateNoteByFolder',
        tags: ['note', 'folder'],
        description: 'Create note by folder',
        querystring: z.object({
          folderId: z.string(),
        }),
        body: z.object({
          title: z.string(),
          content: z.string(),
          tags: z.string().optional(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { folderId } = request.query;
      const { title, content, tags } = request.body;

      await createNoteByFolder({
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
