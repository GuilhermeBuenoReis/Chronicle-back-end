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
