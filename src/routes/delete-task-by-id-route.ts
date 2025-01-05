import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { deleteNoteById } from '../functions/delete-note-by-id';
import { deleteTaskById } from '../functions/delete-task-by-id';

export const deleteTaskByIdRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/task/delete/:id',
    {
      // onRequest: [authenticateUserHook],
      schema: {
        operationId: 'deleteTaskById',
        tags: ['task'],
        description: 'Delete task',
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
      const taskId = request.query.id;
      const { result } = await deleteTaskById({ taskId });

      if (!result) {
        return reply.status(400).send({
          message:
            'Não foi possível deletar> a nota! Tente novamente mais tarde.',
        });
      }

      return reply
        .status(200)
        .send({ message: 'Tarefa deletada com sucesso!' });
    }
  );
};
