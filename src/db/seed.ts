import { client, db } from '.';
import { goalCompletions, goals, users } from './schema';
import dayjs from 'dayjs';

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const [user] = await db
    .insert(users)
    .values({
      name: 'Jhon Doe',
      externalAcountId: 92378489,
      avatarUrl: 'http://github.com/guilhermebuenoreis.png',
    })
    .returning();

  const result = await db
    .insert(goals)
    .values([
      { userId: user.id, title: 'Academia', desiredWeeklyFrequency: 5 },
      { userId: user.id, title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { userId: user.id, title: 'Nadar', desiredWeeklyFrequency: 3 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf('week');

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createAt: startOfWeek.toDate() },
    { goalId: result[2].id, createAt: startOfWeek.add(1, 'day').toDate() },
  ]);
}

seed().finally(() => {
  client.end();
});
