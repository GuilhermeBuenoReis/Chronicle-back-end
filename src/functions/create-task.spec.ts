import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { makeTask } from '../../test/factories/make-task';
import { CreateTask } from './create-task';

describe('create task', () => {
  it('shoud be able to create a new task', async () => {
    const user = await makeUser();
    const task = await makeTask({ userId: user.id });

    const result = await CreateTask({
      title: task.title,
      content: task.content,
      is_completed: task.is_completed,
      userId: task.userId,
    });

    expect(result).toEqual({
      task: expect.objectContaining({
        id: expect.any(String),
        title: task.title,
        content: task.content,
        is_completed: task.is_completed,
      }),
    });
  });
});
