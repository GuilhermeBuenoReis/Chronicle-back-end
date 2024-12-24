import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { CreateNote } from './create-note';
import { makeNotes } from '../../test/factories/make-note';

describe('create note', () => {
  it('shoud be able to create a new note', async () => {
    const user = await makeUser();
    const note = await makeNotes({ userId: user.id, tags: 'Nota 1' });

    const result = await CreateNote({
      title: note.title,
      content: note.content,
      tags: note.tags,
      userId: note.userId,
    });

    expect(result).toEqual({
      note: expect.objectContaining({
        id: expect.any(String),
      }),
    });
  });
});
