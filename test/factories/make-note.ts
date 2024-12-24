import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { notes } from '../../src/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

type NonNullableTags = string;

export async function makeNotes(
  override: Partial<InferSelectModel<typeof notes>> &
    Pick<InferSelectModel<typeof notes>, 'userId'> & {
      tags: NonNullableTags;
    }
) {
  const { tags, ...restOverride } = override;

  const [row] = await db
    .insert(notes)
    .values({
      title: faker.person.jobTitle(),
      content: faker.lorem.lines(),
      tags: tags ?? faker.animal.bear(),
      ...restOverride,
    })
    .returning();

  return row;
}
