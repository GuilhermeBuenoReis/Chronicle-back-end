import { describe, it, expect } from 'vitest';
import { updateTaskById } from './update-task-by-id';
import { CreateTask } from './create-task';
import { makeUser } from '../../test/factories/make-user';
import { makeTask } from '../../test/factories/make-task';

describe('update task by Id', () => {
  it('should be able to update a task', async () => {
    const user = await makeUser();
    const task = await makeTask({ userId: user.id });

    await CreateTask({
      userId: task.userId,
      title: task.title,
      content: task.content,
      is_completed: task.is_completed,
    });

    const result = await updateTaskById({
      title: task.title,
      content: task.content,
      taskId: task.id,
      is_completed: task.is_completed,
    });

    expect(result.updatedTask).toEqual(
      expect.objectContaining({
        id: task.id,
        title: task.title,
        content: task.content,
        is_completed: task.is_completed,
      })
    );
  });
});
