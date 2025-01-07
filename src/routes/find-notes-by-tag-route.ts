import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getUserByEmailAndPassword } from '../functions/find-user-by-email-and-password';
import { FindNoteByTag } from '../functions/find-note-by-tag';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const findNotesByTagsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/notes/find',
    {
      schema: {
        onRequest: [authenticateUserHook],

        operationId: 'getUserByEmailAndPassword',
        tags: ['notes', 'tags'],
        description: 'Get user by email and passowrd',
        body: z.object({
          tags: z.string(),
        }),
        response: {
          200: z.object({
            note: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                content: z.string(),
                tag: z.string(),
                createdAt: z.date(),
              })
            ),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { tags } = request.body;
      const { note } = await FindNoteByTag({ tags });

      if (!tags) {
        return reply
          .status(401)
          .send({ message: 'Nenhuma nota cadastrada com esta tag' });
      }

      return reply.status(200).send({ note });
    }
  );
};
