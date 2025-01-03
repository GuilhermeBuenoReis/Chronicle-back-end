import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { FindNoteByTag } from './find-note-by-tag';
import { findNoteById } from './find-note-by-id';
import { makeNotes } from '../../test/factories/make-note';

describe('find note by id', () => {
  it('should be able to find note by id', async () => {
    const user = await makeUser();
    const noteId = await makeNotes({
      userId: user.id,
      tags: '',
    });

    const result = await findNoteById({
      noteId: noteId.id,
    });

    expect(result).toEqual({
      note: expect.objectContaining({
        tags: '',
        id: expect.any(String),
        title: expect.any(String),
        content: expect.any(String),
        createdAt: expect.any(Date),
      }),
    });
  });
});
