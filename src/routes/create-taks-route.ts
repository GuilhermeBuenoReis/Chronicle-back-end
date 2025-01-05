import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { CreateTask } from '../functions/create-task';

export const createTaskRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/task',
    {
      schema: {
        operationId: 'Create task',
        tags: ['task'],
        description: 'Create a task',
        body: z.object({
          userId: z.string(),
          title: z.string(),
          content: z.string(),
          is_completed: z.boolean(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // const userId = request.user.sub;
      const { title, content, is_completed, userId } = request.body;

      await CreateTask({
        title,
        content,
        userId,
        is_completed,
      });

      return reply.status(201).send({ message: 'Tarefa criada com sucesso' });
    }
  );
};
