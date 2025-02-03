import { eq } from 'drizzle-orm';
import { db } from '../db';
import { tasks } from '../db/schema';

interface UpdateCheckboxFromTaskRequest {
  id: string;
  is_completed: boolean | null;
}

export async function updateCheckboxFromTask({
  id,
  is_completed,
}: UpdateCheckboxFromTaskRequest) {
  const result = await db
    .update(tasks)
    .set({
      is_completed,
    })
    .where(eq(tasks.id, id))
    .returning();

  const updatedTask = result[0];

  if (!updatedTask) {
    throw new Error('Erro ao atualizar a tarefa!');
  }

  return {
    updatedTask,
  };
}
