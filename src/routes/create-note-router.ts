import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateNote } from '../functions/create-note';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const CreateNoteRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/note',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'CreateNote',
        tags: ['note'],
        description: 'Create a folder',
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
      const { title, content, tags } = request.body;

      await CreateNote({
        title,
        content,
        tags,
        userId,
      });

      return reply.status(201).send();
    }
  );
};
