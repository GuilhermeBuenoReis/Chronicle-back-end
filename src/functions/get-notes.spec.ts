import { describe, it, expect } from 'vitest';
import { getNotes } from './get-notes';
import { makeUser } from '../../test/factories/make-user';
import { db } from '../db';
import { notes } from '../db/schema';
import { makeNotes } from '../../test/factories/make-note';

describe('get notes', () => {
  it('should be able to get notes', async () => {
    const user = await makeUser();
    const note = await makeNotes({ userId: user.id, tags: 'Nota' });

    await db.insert(notes).values({
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      userId: user.id,
    });

    const { result } = await getNotes({ userId: user.id });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: note.title,
          content: note.content,
          tags: note.tags,
        }),
      ])
    );
  });
});
