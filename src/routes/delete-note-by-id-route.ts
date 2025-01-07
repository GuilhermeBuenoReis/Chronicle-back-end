import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { deleteNoteById } from '../functions/delete-note-by-id';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const deleteNoteByIdRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/notes/delete/:id',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'deleteNoteById',
        tags: ['goals'],
        description: 'Get pending goals',
        querystring: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),

          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const noteId = request.query.id;
      const { result } = await deleteNoteById({ noteId });

      if (!result) {
        return reply.status(400).send({
          message:
            'Não foi possível deletar> a nota! Tente novamente mais tarde.',
        });
      }

      return reply.status(200).send({ message: 'Nota deletada com sucesso!' });
    }
  );
};
