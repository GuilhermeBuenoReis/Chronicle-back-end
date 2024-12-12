import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createGoalsRoute } from '../routes/craete-goals-route';
import { createGoalCompletionRoute } from '../routes/create-goals-completions-route';
import { getWeekPendingGoalsRoute } from '../routes/get-pending-goals-router';
import { getWeekSummaryRoute } from '../routes/get-week-summary-route';
import fastifyCors from '@fastify/cors';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalsRoute);
app.register(createGoalCompletionRoute);
app.register(getWeekPendingGoalsRoute);
app.register(getWeekSummaryRoute);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Http server running 🚀🚀');
  });
