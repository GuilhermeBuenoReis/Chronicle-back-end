import { describe, it, expect } from 'vitest';
import { updateNoteById } from './update-note-by-id';
import { CreateNote } from './create-note';
import { makeUser } from '../../test/factories/make-user';
import { makeNotes } from '../../test/factories/make-note';

describe('updateNoteById', () => {
  it('should be able to update a note', async () => {
    const user = await makeUser();
    const note = await makeNotes({ userId: user.id, tags: '1' });
    await CreateNote({
      title: note.title,
      userId: user.id,
      content: note.content,
    });

    const result = await updateNoteById({
      title: note.title,
      content: note.content,
      noteId: note.id,
      tags: '1',
    });

    expect(result.updatedNote).toEqual(
      expect.objectContaining({
        id: note.id,
        title: note.title,
        content: note.content,
        tags: '1',
      })
    );
  });
});
