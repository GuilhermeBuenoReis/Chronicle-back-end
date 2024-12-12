import { client, db } from '.';
import { goalCompletions, goals } from './schema';
import dayjs from 'dayjs';

async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: 'Academia', desiredWeeklyFrequency: 5 },
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Nadar', desiredWeeklyFrequency: 3 },
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
