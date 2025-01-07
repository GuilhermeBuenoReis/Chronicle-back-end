import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getTasks } from '../functions/get-tasks';
import { authenticateUserHook } from '../http/hooks/authenticate-user';

export const getTaskRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/task/summary',
    {
      schema: {
        onRequest: [authenticateUserHook],
        operationId: 'getTasksRoute',
        tags: ['task'],
        description: 'Get tasks',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              content: z.string(),
              is_completed: z.boolean().nullable(),
              createAt: z.date(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = 'n6u53804o7fjhg08tit8csc1';
      const { result } = await getTasks({ userId });

      return reply.status(200).send(result);
    }
  );
};
