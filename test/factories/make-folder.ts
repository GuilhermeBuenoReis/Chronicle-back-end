import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { folders } from '../../src/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export async function makeFolder(
  override: Partial<InferSelectModel<typeof folders>> &
    Pick<InferSelectModel<typeof folders>, 'userId'>
) {
  const [row] = await db
    .insert(folders)
    .values({
      name: faker.lorem.word(),
      ...override,
    })
    .returning();

  return row;
}
