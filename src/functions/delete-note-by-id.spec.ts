import { describe, it, expect } from 'vitest';
import { CreateNote } from './create-note';
import { makeUser } from '../../test/factories/make-user';
import { makeNotes } from '../../test/factories/make-note';
import { deleteNoteById } from './delete-note-by-id';
import { findNoteById } from './find-note-by-id';
import { db } from '../db';
import { notes } from '../db/schema';
import { eq } from 'drizzle-orm';

describe('delete note by id', () => {
  it('should be able to delete a note by id', async () => {
    const user = await makeUser();
    const note = await makeNotes({ userId: user.id, tags: '1' });
    await CreateNote({
      title: note.title,
      userId: user.id,
      content: note.content,
    });

    await deleteNoteById({
      noteId: note.id,
    });

    const deletedNote = await db
      .select()
      .from(notes)
      .where(eq(notes.id, note.id));

    expect(deletedNote).toEqual(expect.arrayContaining([]));
  });
});
