import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes, tasks } from '../db/schema';

interface findTaskByIdRequest {
  taskId: string;
}

interface UpdateTaskById {
  title: string;
  content: string;
  is_completed: boolean | null;
}

type UpdatedTaskPartial = Partial<UpdateTaskById> & findTaskByIdRequest;

export async function updateTaskById({
  content,
  title,
  taskId,
  is_completed,
}: UpdatedTaskPartial) {
  const result = await db
    .update(tasks)
    .set({
      title,
      content,
      is_completed,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  const updatedTask = result[0];

  if (!updateTaskById) {
    throw new Error('Erro ao atualizar a tarefa!');
  }

  return {
    updatedTask,
  };
}
