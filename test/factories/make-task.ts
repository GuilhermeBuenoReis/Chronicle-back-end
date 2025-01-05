import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { tasks } from '../../src/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export async function makeTask(
  override: Partial<InferSelectModel<typeof tasks>> &
    Pick<InferSelectModel<typeof tasks>, 'userId'>
) {
  const [row] = await db
    .insert(tasks)
    .values({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      is_completed: faker.datatype.boolean(),
      ...override,
    })
    .returning();

  return row;
}
