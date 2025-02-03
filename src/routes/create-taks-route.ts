import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateTask } from '../functions/create-task';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const createTaskRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/task',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'Create task',
        tags: ['task'],
        description: 'Create a task',
        body: z.object({
          title: z.string(),
          content: z.string(),
          is_completed: z.boolean(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            task: z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              is_completed: z.boolean().nullable(),
              createAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { title, content, is_completed } = request.body;

      const result = await CreateTask({
        title,
        content,
        userId,
        is_completed,
      });

      return reply
        .status(201)
        .send({ message: 'Tarefa criada com sucesso', task: result.task });
    }
  );
};
