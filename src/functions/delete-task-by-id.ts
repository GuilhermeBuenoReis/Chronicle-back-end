import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes, tasks } from '../db/schema';

interface DeleteTaskByIdRequest {
  taskId: string;
}

export async function deleteTaskById({ taskId }: DeleteTaskByIdRequest) {
  const result = await db.delete(tasks).where(eq(tasks.id, taskId));

  return {
    result,
  };
}
