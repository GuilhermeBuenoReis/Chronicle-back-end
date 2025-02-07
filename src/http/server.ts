import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createGoalsRoute } from '../routes/craete-goals-route';
import { createGoalCompletionRoute } from '../routes/create-goals-completions-route';
import { getWeekPendingGoalsRoute } from '../routes/get-pending-goals-router';
import { getWeekSummaryRoute } from '../routes/get-week-summary-route';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { authenticateFromGithubRoute } from '../routes/authenticate-from-github-route';
import fastifyJwt from '@fastify/jwt';
import { env } from '../env';
import { getProfileRoute } from '../routes/get-profile-route';
import { getUserLevelAndExperienceRoute } from '../routes/get-user-level-and-experience-route';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { CreateFoldersRoute } from '../routes/create-folder-route';
import { CreateUserRoute } from '../routes/create-user-route';
import { getUserByEmailAndPasswordRoute } from '../routes/find-user-by-email-and-password-route';
import { AuthenticateUserRoute } from '../routes/authenticate-user-route';
import { CreateNoteRoute } from '../routes/create-note-router';
import { getNotesRoute } from '../routes/get-notes-route';
import { findNotesByTagsRoute } from '../routes/find-notes-by-tag-route';
import { findNotesByIdRoute } from '../routes/find-note-by-id-route';
import { updatedNoteRoute } from '../routes/update-note-route';
import { deleteNoteByIdRoute } from '../routes/delete-note-by-id-route';
import { createTaskRoute } from '../routes/create-taks-route';
import { getTaskRoute } from '../routes/get-task-route';
import { updateTaskById } from '../functions/update-task-by-id';
import { updatedTaskByIdRoute } from '../routes/update-task-by-id-route';
import { deleteTaskByIdRoute } from '../routes/delete-task-by-id-route';
import { getFoldersRoute } from '../routes/get-folders';
import { getNotesWithFolderRoute } from '../routes/get-notes-with-folder-route';
import { CreateNoteByFolderRoute } from '../routes/create-note-by-folder';
import { updateCheckboxFromTask } from '../functions/update-checkbox-from-task';
import { updatedCheckboxFromTaskRoute } from '../routes/update-checkbox-from-task-route';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'in-orbit',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.register(createGoalsRoute);
app.register(createGoalCompletionRoute);
app.register(getWeekPendingGoalsRoute);
app.register(getWeekSummaryRoute);
app.register(authenticateFromGithubRoute);
app.register(getProfileRoute);
app.register(getUserLevelAndExperienceRoute);
app.register(CreateFoldersRoute);
app.register(CreateUserRoute);
app.register(getUserByEmailAndPasswordRoute);
app.register(AuthenticateUserRoute);
app.register(CreateNoteRoute);
app.register(getNotesRoute);
app.register(findNotesByTagsRoute);
app.register(findNotesByIdRoute);
app.register(updatedNoteRoute);
app.register(deleteNoteByIdRoute);
app.register(createTaskRoute);
app.register(getTaskRoute);
app.register(updatedTaskByIdRoute);
app.register(deleteTaskByIdRoute);
app.register(getFoldersRoute);
app.register(getNotesWithFolderRoute);
app.register(CreateNoteByFolderRoute);
app.register(updatedCheckboxFromTaskRoute);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Http server running 🚀🚀');
  });

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json');

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2);

    writeFile(specFile, spec).then(() => {
      console.log('Swagger spec generated!');
    });
  });
}
