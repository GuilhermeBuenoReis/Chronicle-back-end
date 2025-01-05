import { eq } from 'drizzle-orm';
import { db } from '../db';
import { tasks } from '../db/schema';

interface GetTaskRequest {
  userId: string;
}

export async function getTasks({ userId }: GetTaskRequest) {
  const result = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      content: tasks.content,
      is_completed: tasks.is_completed,
      createAt: tasks.createAt,
    })
    .from(tasks)
    .where(eq(tasks.userId, userId));

  return {
    result,
  };
}
