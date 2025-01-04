import { describe, it, expect } from 'vitest';
import { CreateNote } from './create-note';
import { makeUser } from '../../test/factories/make-user';
import { makeNotes } from '../../test/factories/make-note';
import { deleteNoteById } from './delete-note-by-id';
import { findNoteById } from './find-note-by-id';

describe('delete note by id', () => {
  it('should be able to delete a note by id', async () => {
    const user = await makeUser();
    const note = await makeNotes({ userId: user.id, tags: '1' });
    await CreateNote({
      title: note.title,
      userId: user.id,
      content: note.content,
    });

    const result = await deleteNoteById({
      noteId: note.id,
    });

    const deletedNote = await findNoteById({ noteId: note.id });
    expect(deletedNote.note).toBeUndefined();
  });
});
