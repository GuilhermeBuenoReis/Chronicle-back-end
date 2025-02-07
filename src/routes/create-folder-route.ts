import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { authenticateUserHook } from '../http/hooks/authenticate-user';
import { CreateFolder } from '../functions/create-folder';

export const CreateFoldersRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/folder',
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: 'CreateFolders',
        tags: ['folder'],
        description: 'Create a folder',
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { name } = request.body;

      await CreateFolder({
        userId,
        name,
      });

      return reply.status(201).send();
    }
  );
};
