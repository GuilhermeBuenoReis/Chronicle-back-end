import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { updateNoteById } from '../functions/update-note-by-id';
import { updateTaskById } from '../functions/update-task-by-id';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { updateCheckboxFromTask } from '../functions/update-checkbox-from-task';

export const updatedCheckboxFromTaskRoute: FastifyPluginAsyncZod =
  async app => {
    app.put(
      '/task/update/',
      {
        onRequest: [authenticateUserHook],
        schema: {
          operationId: 'updatedCheckboxFromTask',
          tags: ['task'],
          description: 'updated task',
          querystring: z.object({
            id: z.string(),
          }),
          body: z.object({
            is_completed: z.boolean().optional().default(false),
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
        const id = request.query.id;
        const { is_completed } = request.body;
        const { updatedTask } = await updateCheckboxFromTask({
          is_completed,
          id,
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
