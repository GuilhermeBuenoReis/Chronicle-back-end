import { describe, it, expect } from 'vitest';
import { getNotes } from './get-notes';
import { makeUser } from '../../test/factories/make-user';
import { db } from '../db';
import { notes, tasks } from '../db/schema';
import { makeNotes } from '../../test/factories/make-note';
import { makeTask } from '../../test/factories/make-task';
import { getTasks } from './get-tasks';

describe('get task', () => {
  it('should be able to get task', async () => {
    const user = await makeUser();
    const task = await makeTask({ userId: user.id });

    await db.insert(tasks).values({
      title: task.title,
      content: task.content,
      createAt: task.createAt,
      is_completed: task.is_completed,
      userId: user.id,
    });

    const { result } = await getTasks({ userId: user.id });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: task.title,
          content: task.content,
          createAt: task.createAt,
          is_completed: task.is_completed,
        }),
      ])
    );
  });
});
