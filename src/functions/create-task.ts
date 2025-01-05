import { db } from '../db';
import { tasks } from '../db/schema';

interface CreateNoteRequest {
  title: string;
  content: string;
  userId: string;
  is_completed: boolean | null;
}

export async function CreateTask({
  userId,
  content,
  title,
  is_completed,
}: CreateNoteRequest) {
  const result = await db
    .insert(tasks)
    .values({
      title,
      content,
      userId,
      is_completed,
    })
    .returning();

  const task = result[0];

  return {
    task,
  };
}
