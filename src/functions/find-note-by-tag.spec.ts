import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { FindNoteByTag } from './find-note-by-tag';

describe('find note by tag', () => {
  it('should be able to find note by tag', async () => {
    const user = await makeUser();

    const result = await FindNoteByTag({
      tags: 'Nota 1',
    });

    expect(result).toEqual({
      note: expect.arrayContaining([
        expect.objectContaining({
          tag: 'Nota 1',
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(Date),
        }),
      ]),
    });
  });
});
