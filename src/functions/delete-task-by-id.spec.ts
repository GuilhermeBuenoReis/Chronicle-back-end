import { describe, it, expect } from 'vitest';
import { CreateNote } from './create-note';
import { makeUser } from '../../test/factories/make-user';
import { makeNotes } from '../../test/factories/make-note';
import { deleteNoteById } from './delete-note-by-id';
import { findNoteById } from './find-note-by-id';
import { CreateTask } from './create-task';
import { makeTask } from '../../test/factories/make-task';
import { deleteTaskById } from './delete-task-by-id';
import { db } from '../db';
import { tasks } from '../db/schema';

import { eq } from 'drizzle-orm';

describe('delete note by id', () => {
  it('should be able to delete a note by id', async () => {
    const user = await makeUser();
    const task = await makeTask({ userId: user.id });
    await CreateTask({
      title: task.title,
      userId: user.id,
      content: task.content,
      is_completed: task.is_completed,
    });

    await deleteTaskById({
      taskId: task.id,
    });

    const deletedTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, task.id));

    expect(deletedTask).toEqual(expect.arrayContaining([]));
  });
});
