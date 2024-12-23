import { describe, it, expect } from 'vitest';
import { getNote } from './get-week-notes';
import { makeUser } from '../../test/factories/make-user';
import { db } from '../db';
import { notes } from '../db/schema';

describe('get notes', () => {
  it('should be able to get notes', async () => {
    const user = await makeUser();

    const note = {
      id: 'Nota5',
      title: 'nota nova',
      content: 'apenas uma nova nota',
      tags: ['nota1', 'nota2'],
      createdAt: new Date(),
    };

    await db.insert(notes).values({
      id: note.id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      userId: user.id,
    });

    const { result } = await getNote({ userId: user.id });

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags,
        }),
      ])
    );
  });
});
