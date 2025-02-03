import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { updateNoteById } from '../functions/update-note-by-id';
import { updateTaskById } from '../functions/update-task-by-id';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const updatedTaskByIdRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/task/update/:id',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'updatedTaskById',
        tags: ['task'],
        description: 'updated task',
        querystring: z.object({
          id: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          is_completed: z.boolean().optional(),
        }),
        response: {
          201: z.object({
            updatedTask: z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              is_completed: z.boolean().nullable(),
              createAt: z.date(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const taskId = request.query.id;
      const { title, content, is_completed } = request.body;
      const { updatedTask } = await updateTaskById({
        title,
        content,
        taskId,
        is_completed,
      });

      if (!updatedTask) {
        return reply.status(401).send({
          message:
            'Não foi possível atualizar a nota! Tente novamente mais tarde.',
        });
      }

      return reply.status(201).send({ updatedTask });
    }
  );
};
